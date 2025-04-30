
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Updated Address type definition to match the database schema
interface Address {
  id: string;
  user_id: string;
  name: string; // Renamed from full_name to match property access
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
  is_default: boolean;
}

export function DeliveryAddressDropdown() {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    phone_number: '',
    is_default: false
  });

  // Fetch user addresses
  useEffect(() => {
    if (currentUser) {
      fetchAddresses();
    }
  }, [currentUser]);

  const fetchAddresses = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('is_default', { ascending: false });

      if (error) throw error;

      setAddresses(data);
      const defaultAddress = data.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          user_id: currentUser.id,
          name: formData.full_name,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2 || null,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          phone_number: formData.phone_number,
          is_default: addresses.length === 0 ? true : formData.is_default
        })
        .select()
        .single();

      if (error) throw error;

      // Update addresses list
      await fetchAddresses();
      setIsAddingNew(false);
      resetForm();
      toast({
        title: "Address added",
        description: "Your delivery address has been added successfully",
      });
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: "Failed to add address",
        description: "There was an error saving your address",
        variant: "destructive"
      });
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      // First, reset all addresses to non-default
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', currentUser?.id);

      // Then, set the selected address as default
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      // Refresh addresses
      await fetchAddresses();

      toast({
        title: "Default address updated",
        description: "Your default delivery address has been updated"
      });
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: "Failed to update default address",
        description: "There was an error updating your default address",
        variant: "destructive"
      });
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh addresses
      await fetchAddresses();

      toast({
        title: "Address deleted",
        description: "Your delivery address has been deleted"
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Failed to delete address",
        description: "There was an error deleting your address",
        variant: "destructive"
      });
    }
  };

  const handleSelect = (address: Address) => {
    setSelectedAddress(address);
    setIsOpen(false);
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      phone_number: '',
      is_default: false
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          className="flex items-center space-x-1 text-sm hover:text-blue-200 cursor-pointer"
          aria-label="Delivery location"
        >
          <MapPin className="h-5 w-5" />
          <div className="flex flex-col items-start">
            <span className="text-gray-300 text-xs">Deliver to</span>
            <span className="font-bold">
              {selectedAddress 
                ? `${selectedAddress.city} ${selectedAddress.postal_code}` 
                : 'Select Address'
              }
            </span>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Delivery Address</DialogTitle>
        </DialogHeader>

        {!currentUser ? (
          <div className="text-center py-6">
            <p className="mb-4">Sign in to manage your delivery addresses</p>
            <Button 
              onClick={() => window.location.href = '/auth/login'}
              className="w-full mb-2 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              Sign In
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            {isLoading ? (
              <div className="text-center py-4">Loading addresses...</div>
            ) : (
              <>
                {/* Address List */}
                {!isAddingNew && (
                  <div className="space-y-4">
                    {addresses.length > 0 ? (
                      addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddress?.id === address.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-600'
                              : 'hover:border-blue-200 dark:hover:border-blue-700'
                          }`}
                          onClick={() => handleSelect(address)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold">{address.name}</div>
                              <div>{address.address_line1}</div>
                              {address.address_line2 && <div>{address.address_line2}</div>}
                              <div>{`${address.city}, ${address.state} ${address.postal_code}`}</div>
                              <div>{address.country}</div>
                              <div className="text-sm text-gray-500 mt-1">{address.phone_number}</div>
                            </div>
                            {address.is_default && (
                              <span className="text-blue-600 text-sm font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex gap-2">
                            {!address.is_default && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDefaultAddress(address.id);
                                }}
                              >
                                Set as Default
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAddress(address.id);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p>You don't have any saved addresses.</p>
                      </div>
                    )}

                    <Button
                      onClick={() => setIsAddingNew(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Add New Address
                    </Button>
                  </div>
                )}

                {/* Add New Address Form */}
                {isAddingNew && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      placeholder="Full Name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      required
                    />
                    <Input
                      placeholder="Address Line 1"
                      value={formData.address_line1}
                      onChange={(e) => setFormData(prev => ({ ...prev, address_line1: e.target.value }))}
                      required
                    />
                    <Input
                      placeholder="Address Line 2 (Optional)"
                      value={formData.address_line2}
                      onChange={(e) => setFormData(prev => ({ ...prev, address_line2: e.target.value }))}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        required
                      />
                      <Input
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Postal Code"
                        value={formData.postal_code}
                        onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                        required
                      />
                      <Input
                        placeholder="Country"
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        required
                      />
                    </div>
                    <Input
                      placeholder="Phone Number"
                      value={formData.phone_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                      required
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_default"
                        checked={formData.is_default}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor="is_default">Set as default address</label>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Save Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddingNew(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
