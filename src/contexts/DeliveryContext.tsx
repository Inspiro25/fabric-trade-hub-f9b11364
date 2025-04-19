import React, { createContext, useContext, useState, useEffect } from 'react';
import { Address, DeliveryLocation } from '@/lib/types/address';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase/client';

interface DeliveryContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  currentLocation: DeliveryLocation | null;
  isLoadingAddresses: boolean;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  selectAddress: (address: Address) => void;
  updateCurrentLocation: (location: DeliveryLocation) => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export function DeliveryProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [currentLocation, setCurrentLocation] = useState<DeliveryLocation | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Load addresses when user changes
  useEffect(() => {
    if (currentUser) {
      loadAddresses();
    } else {
      setAddresses([]);
      setSelectedAddress(null);
    }
  }, [currentUser]);

  // Load addresses from Supabase
  const loadAddresses = async () => {
    if (!currentUser) return;

    try {
      setIsLoadingAddresses(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('isDefault', { ascending: false });

      if (error) throw error;

      setAddresses(data);
      const defaultAddress = data.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        setCurrentLocation({
          city: defaultAddress.city,
          state: defaultAddress.state,
          postalCode: defaultAddress.postalCode,
          isSelected: true
        });
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert([{ ...address, user_id: currentUser.id }])
        .select()
        .single();

      if (error) throw error;

      setAddresses(prev => [...prev, data]);
      if (address.isDefault || addresses.length === 0) {
        setSelectedAddress(data);
        setCurrentLocation({
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          isSelected: true
        });
      }
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  };

  const updateAddress = async (id: string, address: Partial<Address>) => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .update(address)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAddresses(prev => prev.map(addr => addr.id === id ? { ...addr, ...data } : addr));
      if (selectedAddress?.id === id) {
        setSelectedAddress({ ...selectedAddress, ...data });
        setCurrentLocation({
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          isSelected: true
        });
      }
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAddresses(prev => prev.filter(addr => addr.id !== id));
      if (selectedAddress?.id === id) {
        const newDefault = addresses.find(addr => addr.id !== id);
        setSelectedAddress(newDefault || null);
        if (newDefault) {
          setCurrentLocation({
            city: newDefault.city,
            state: newDefault.state,
            postalCode: newDefault.postalCode,
            isSelected: true
          });
        } else {
          setCurrentLocation(null);
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      // First, remove default from all addresses
      await supabase
        .from('addresses')
        .update({ isDefault: false })
        .eq('user_id', currentUser?.id);

      // Then set the new default
      const { data, error } = await supabase
        .from('addresses')
        .update({ isDefault: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));

      setSelectedAddress(data);
      setCurrentLocation({
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        isSelected: true
      });
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  };

  const selectAddress = (address: Address) => {
    setSelectedAddress(address);
    setCurrentLocation({
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      isSelected: true
    });
  };

  const updateCurrentLocation = (location: DeliveryLocation) => {
    setCurrentLocation(location);
  };

  return (
    <DeliveryContext.Provider value={{
      addresses,
      selectedAddress,
      currentLocation,
      isLoadingAddresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      selectAddress,
      updateCurrentLocation,
    }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
} 