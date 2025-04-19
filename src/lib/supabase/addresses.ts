import { supabase } from './client';
import { Address, AddressFormData } from '../types/address';

export async function getAddresses(userId: string): Promise<Address[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }

  return data || [];
}

export async function addAddress(userId: string, address: AddressFormData): Promise<Address> {
  const { data, error } = await supabase
    .from('addresses')
    .insert([{ ...address, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('Error adding address:', error);
    throw error;
  }

  return data;
}

export async function updateAddress(addressId: string, address: Partial<Address>): Promise<Address> {
  const { data, error } = await supabase
    .from('addresses')
    .update(address)
    .eq('id', addressId)
    .select()
    .single();

  if (error) {
    console.error('Error updating address:', error);
    throw error;
  }

  return data;
}

export async function deleteAddress(addressId: string): Promise<void> {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId);

  if (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
}

export async function setDefaultAddress(userId: string, addressId: string): Promise<void> {
  // Start a transaction to update addresses
  const { error: updateError } = await supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Error updating addresses:', updateError);
    throw updateError;
  }

  const { error: setDefaultError } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', addressId);

  if (setDefaultError) {
    console.error('Error setting default address:', setDefaultError);
    throw setDefaultError;
  }
} 