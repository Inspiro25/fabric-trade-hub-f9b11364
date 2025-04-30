
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Address, AddressFormData, AddressContextType } from '@/types/address';
import { toast } from 'sonner';

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchAddresses();
    }
  }, [currentUser]);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', currentUser?.id || '')
        .order('is_default', { ascending: false });

      if (error) {
        throw error;
      }

      // Map the database fields to our interface structure
      const mappedAddresses = data.map(address => ({
        id: address.id,
        user_id: address.user_id,
        name: address.name || address.full_name || '', 
        full_name: address.full_name,
        address_line1: address.address_line1,
        address_line2: address.address_line2,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        phone_number: address.phone_number,
        is_default: address.is_default,
        created_at: address.created_at,
        updated_at: address.updated_at || address.created_at
      }));
      
      setAddresses(mappedAddresses);
      
      // If there's a default address, set it as selected
      const defaultAddress = mappedAddresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (mappedAddresses.length > 0) {
        setSelectedAddress(mappedAddresses[0]);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch addresses'));
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (addressData: AddressFormData) => {
    if (!currentUser?.id) {
      toast.error('You need to be logged in to add an address.');
      return;
    }

    try {
      setIsLoading(true);
      
      // If this is the first address, make it the default
      const isFirst = addresses.length === 0;
      const isDefault = isFirst || addressData.is_default;
      
      // Map to database structure
      const newAddressData = {
        user_id: currentUser.id,
        name: addressData.name,
        full_name: addressData.full_name || addressData.name,
        address_line1: addressData.address_line1,
        address_line2: addressData.address_line2 || '',
        city: addressData.city,
        state: addressData.state,
        postal_code: addressData.postal_code,
        country: addressData.country,
        phone_number: addressData.phone_number,
        is_default: isDefault,
      };
      
      const { data, error } = await supabase
        .from('user_addresses')
        .insert([newAddressData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Map database response to our interface
      const newAddress: Address = {
        id: data.id,
        user_id: data.user_id,
        name: data.name || data.full_name || '',
        full_name: data.full_name,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        phone_number: data.phone_number,
        is_default: data.is_default,
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at
      };
      
      // If this is set as default, update all other addresses
      if (isDefault) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .neq('id', data.id)
          .eq('user_id', currentUser.id);
          
        // Update local state for other addresses
        setAddresses(prev => 
          prev.map(addr => ({
            ...addr,
            is_default: addr.id === data.id
          }))
        );
      }
      
      // Add new address to state
      setAddresses(prev => [...prev, newAddress]);
      
      // Set as selected if it's the only one or marked as default
      if (isDefault || addresses.length === 0) {
        setSelectedAddress(newAddress);
      }
      
      toast.success('Address added successfully');
    } catch (err) {
      console.error('Error adding address:', err);
      toast.error('Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async (id: string, addressData: Partial<Address>) => {
    try {
      setIsLoading(true);
      
      // Map to database structure
      const updateData: any = {};
      
      if (addressData.name !== undefined) {
        updateData.name = addressData.name;
        // If updating name, also update full_name if it matches the old name
        const oldAddress = addresses.find(a => a.id === id);
        if (oldAddress && oldAddress.name === oldAddress.full_name) {
          updateData.full_name = addressData.name;
        }
      }
      
      if (addressData.full_name !== undefined) updateData.full_name = addressData.full_name;
      if (addressData.address_line1 !== undefined) updateData.address_line1 = addressData.address_line1;
      if (addressData.address_line2 !== undefined) updateData.address_line2 = addressData.address_line2;
      if (addressData.city !== undefined) updateData.city = addressData.city;
      if (addressData.state !== undefined) updateData.state = addressData.state;
      if (addressData.postal_code !== undefined) updateData.postal_code = addressData.postal_code;
      if (addressData.country !== undefined) updateData.country = addressData.country;
      if (addressData.phone_number !== undefined) updateData.phone_number = addressData.phone_number;
      if (addressData.is_default !== undefined) updateData.is_default = addressData.is_default;
      
      const { data, error } = await supabase
        .from('user_addresses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Map database response to our interface
      const updatedAddress: Address = {
        id: data.id,
        user_id: data.user_id,
        name: data.name || data.full_name || '',
        full_name: data.full_name,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        phone_number: data.phone_number,
        is_default: data.is_default,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      // If setting as default, update all other addresses
      if (addressData.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .neq('id', id)
          .eq('user_id', currentUser?.id || '');
          
        // Update state
        setAddresses(prev => 
          prev.map(addr => ({
            ...addr,
            is_default: addr.id === id
          }))
        );
      } else {
        // Standard update
        setAddresses(prev => 
          prev.map(addr => addr.id === id ? updatedAddress : addr)
        );
      }
      
      // Update selected address if needed
      if (selectedAddress?.id === id) {
        setSelectedAddress(updatedAddress);
      }
      
      toast.success('Address updated successfully');
    } catch (err) {
      console.error('Error updating address:', err);
      toast.error('Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update state
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      
      // If deleted address was selected, clear selection
      if (selectedAddress?.id === id) {
        setSelectedAddress(null);
      }
      
      toast.success('Address deleted successfully');
    } catch (err) {
      console.error('Error deleting address:', err);
      toast.error('Failed to delete address');
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Set the new default address
      const { data, error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update all other addresses to is_default: false
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .neq('id', id)
        .eq('user_id', currentUser?.id || '');
      
      // Update state
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          is_default: addr.id === id
        }))
      );
      
      // Update selected address
      const newDefault = addresses.find(addr => addr.id === id);
      if (newDefault) {
        setSelectedAddress(newDefault);
      }
      
      toast.success('Default address updated successfully');
    } catch (err) {
      console.error('Error setting default address:', err);
      toast.error('Failed to set default address');
    } finally {
      setIsLoading(false);
    }
  };

  const selectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  const value: AddressContextType = {
    addresses,
    selectedAddress,
    isLoading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddressContext must be used within a AddressProvider');
  }
  return context;
};
