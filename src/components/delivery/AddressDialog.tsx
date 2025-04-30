
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MapPin, Plus } from 'lucide-react';
import { useAddressContext } from '@/contexts/AddressContext';
import { Address, AddressFormData } from '@/types/address';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function AddressDialog() {
  const { currentUser } = useAuth();
  const { 
    addresses, 
    selectedAddress, 
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
    fetchAddresses 
  } = useAddressContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    name: '',
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone_number: '',
    is_default: false,
  });

  const clearForm = () => {
    setFormData({
      name: '',
      full_name: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      phone_number: '',
      is_default: false
    });
  };

  useEffect(() => {
    if (currentUser) {
      console.log('Fetching addresses for user:', currentUser.id);
      fetchAddresses();
    }
  }, [currentUser, fetchAddresses]);

  useEffect(() => {
    if (selectedAddress) {
      setFormData({
        name: selectedAddress.name || '',
        full_name: selectedAddress.full_name || selectedAddress.name || '',
        address_line1: selectedAddress.address_line1,
        address_line2: selectedAddress.address_line2 || '',
        city: selectedAddress.city,
        state: selectedAddress.state,
        postal_code: selectedAddress.postal_code,
        country: selectedAddress.country,
        phone_number: selectedAddress.phone_number,
        is_default: selectedAddress.is_default
      });
    } else {
      clearForm();
    }
  }, [selectedAddress, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAddress(formData);
      setIsAddingNew(false);
      setFormData({
        name: '',
        full_name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        phone_number: '',
        is_default: false,
      });
      toast.success('Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleSelect = (address: Address) => {
    console.log('Selecting address:', address);
    selectAddress(address);
    setIsOpen(false);
    toast.success('Address selected');
  };

  const handleOpenChange = (open: boolean) => {
    console.log('Dialog open state changed:', open);
    setIsOpen(open);
  };

  console.log('Current state:', { isOpen, isLoading, addressesCount: addresses.length });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button 
          className="flex items-center space-x-1 text-sm hover:text-blue-200 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <MapPin className="h-5 w-5" />
          <div className="flex flex-col items-start">
            <span className="text-gray-300 text-xs">Deliver to</span>
            <span className="font-bold">
              {selectedAddress ? `${selectedAddress.city} ${selectedAddress.postal_code}` : 'Select Address'}
            </span>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg z-[9999]">
        <DialogHeader>
          <DialogTitle>Select a delivery address</DialogTitle>
        </DialogHeader>

        {!currentUser ? (
          <div className="text-center py-4">
            <p className="mb-4">Sign in to access your addresses</p>
            <Button onClick={() => window.location.href = '/login'}>
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
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddress?.id === address.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'hover:border-blue-200 dark:hover:border-blue-700'
                        }`}
                        onClick={() => handleSelect(address)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{address.full_name}</div>
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
                    ))}

                    <Button
                      onClick={() => setIsAddingNew(true)}
                      className="w-full"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
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
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value, full_name: e.target.value }))}
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
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Save Address
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingNew(false)}
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
