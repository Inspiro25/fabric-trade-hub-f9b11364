import React, { createContext, useContext, useState, useCallback } from 'react';
import { Address, AddressFormData, AddressContextType } from '../types/address';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', currentUser.id);

      if (fetchError) throw fetchError;

      const formattedAddresses: Address[] = data.map(addr => ({
        id: addr.id,
        user_id: addr.user_id,
        full_name: addr.name,
        address_line1: addr.address_line1,
        address_line2: addr.address_line2 || undefined,
        city: addr.city,
        state: addr.state,
        postal_code: addr.postal_code,
        country: addr.country,
        phone_number: addr.phone_number || '',
        is_default: addr.is_default,
        created_at: addr.created_at,
        updated_at: addr.created_at // Using created_at as updated_at if not available
      }));

      setAddresses(formattedAddresses);
      // Set the default address as selected if available
      const defaultAddress = formattedAddresses.find(addr => addr.is_default);
      if (defaultAddress && !selectedAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to fetch addresses');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, selectedAddress]);

  const addAddress = useCallback(async (address: AddressFormData) => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    try {
      const { data, error: addError } = await supabase
        .from('user_addresses')
        .insert({
          user_id: currentUser.id,
          name: address.full_name,
          address_line1: address.address_line1,
          address_line2: address.address_line2,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
          phone_number: address.phone_number,
          is_default: address.is_default || false
        })
        .select()
        .single();

      if (addError) throw addError;

      const newAddress: Address = {
        id: data.id,
        user_id: data.user_id,
        full_name: data.name,
        address_line1: data.address_line1,
        address_line2: data.address_line2 || undefined,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        phone_number: data.phone_number || '',
        is_default: data.is_default,
        created_at: data.created_at,
        updated_at: data.created_at
      };

      setAddresses(prev => [...prev, newAddress]);
      toast.success('Address added successfully');
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to add address');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  const updateAddress = useCallback(async (id: string, address: Partial<Address>) => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    try {
      const updateData: any = {};
      if (address.full_name) updateData.name = address.full_name;
      if (address.address_line1) updateData.address_line1 = address.address_line1;
      if (address.address_line2 !== undefined) updateData.address_line2 = address.address_line2;
      if (address.city) updateData.city = address.city;
      if (address.state) updateData.state = address.state;
      if (address.postal_code) updateData.postal_code = address.postal_code;
      if (address.country) updateData.country = address.country;
      if (address.phone_number) updateData.phone_number = address.phone_number;
      if (address.is_default !== undefined) updateData.is_default = address.is_default;

      const { data, error: updateError } = await supabase
        .from('user_addresses')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', currentUser.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedAddress: Address = {
        id: data.id,
        user_id: data.user_id,
        full_name: data.name,
        address_line1: data.address_line1,
        address_line2: data.address_line2 || undefined,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        phone_number: data.phone_number || '',
        is_default: data.is_default,
        created_at: data.created_at,
        updated_at: data.created_at
      };

      setAddresses(prev => prev.map(addr => addr.id === id ? updatedAddress : addr));
      if (selectedAddress?.id === id) {
        setSelectedAddress(updatedAddress);
      }
      toast.success('Address updated successfully');
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to update address');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, selectedAddress?.id]);

  const deleteAddress = useCallback(async (id: string) => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.id);

      if (deleteError) throw deleteError;

      setAddresses(prev => prev.filter(addr => addr.id !== id));
      if (selectedAddress?.id === id) {
        setSelectedAddress(null);
      }
      toast.success('Address deleted successfully');
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to delete address');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, selectedAddress?.id]);

  const setDefaultAddress = useCallback(async (id: string) => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    try {
      // First, set all addresses to non-default
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', currentUser.id);

      // Then set the selected address as default
      const { data, error: updateError } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', currentUser.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedAddress: Address = {
        id: data.id,
        user_id: data.user_id,
        full_name: data.name,
        address_line1: data.address_line1,
        address_line2: data.address_line2 || undefined,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        phone_number: data.phone_number || '',
        is_default: data.is_default,
        created_at: data.created_at,
        updated_at: data.created_at
      };

      setAddresses(prev => prev.map(addr => ({
        ...addr,
        is_default: addr.id === id
      })));
      setSelectedAddress(updatedAddress);
      toast.success('Default address updated successfully');
    } catch (err) {
      setError(err as Error);
      toast.error('Failed to update default address');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  const selectAddress = useCallback((address: Address) => {
    setSelectedAddress(address);
  }, []);

  const value = {
    addresses,
    selectedAddress,
    isLoading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};

export default AddressContext;