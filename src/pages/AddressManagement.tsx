
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Address } from '@/types/address';
import { MapPin, Plus, Home, Briefcase, Plus as PlusIcon } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';

export default function AddressManagement() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
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

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login');
    } else {
      fetchAddresses();
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        full_name: editingAddress.name || '',
        address_line1: editingAddress.address_line1 || '',
        address_line2: editingAddress.address_line2 || '',
        city: editingAddress.city || '',
        state: editingAddress.state || '',
        postal_code: editingAddress.postal_code || '',
        country: editingAddress.country || 'India',
        phone_number: editingAddress.phone_number || '',
        is_default: editingAddress.is_default || false
      });
    }
  }, [editingAddress]);

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
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast({
        title: "Failed to load addresses",
        description: "There was an error loading your saved addresses",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from('user_addresses')
          .update({
            name: formData.full_name,
            address_line1: formData.address_line1,
            address_line2: formData.address_line2 || null,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
            phone_number: formData.phone_number,
            is_default: formData.is_default
          })
          .eq('id', editingAddress.id);

        if (error) throw error;

        toast({
          title: "Address updated",
          description: "Your address has been updated successfully",
        });
      } else {
        // Add new address
        const { error } = await supabase
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
          });

        if (error) throw error;

        toast({
          title: "Address added",
          description: "Your new address has been added successfully",
        });
      }

      // If setting as default, update other addresses
      if (formData.is_default) {
        await setDefaultAddress(editingAddress?.id);
      }

      resetForm();
      setEditingAddress(null);
      setIsDialogOpen(false);
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Failed to save address",
        description: "There was an error saving your address",
        variant: "destructive"
      });
    }
  };

  const setDefaultAddress = async (currentId?: string) => {
    try {
      // First, reset all addresses to non-default
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', currentUser?.id);

      // Then, set the selected address as default
      if (currentId) {
        const { error } = await supabase
          .from('user_addresses')
          .update({ is_default: true })
          .eq('id', currentId);

        if (error) throw error;

        toast({
          title: "Default address updated",
          description: "Your default delivery address has been updated"
        });

        fetchAddresses();
      }
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
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const { error } = await supabase
          .from('user_addresses')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Address deleted",
          description: "Your address has been deleted successfully"
        });
        fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        toast({
          title: "Failed to delete address",
          description: "There was an error deleting your address",
          variant: "destructive"
        });
      }
    }
  };

  const editAddress = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const addNewAddress = () => {
    resetForm();
    setEditingAddress(null);
    setIsDialogOpen(true);
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
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Your Addresses</h1>
        <Button 
          onClick={addNewAddress} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading your addresses...</div>
      ) : addresses.length === 0 ? (
        <Card className="border border-dashed border-gray-300">
          <CardContent className="py-12">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-xl font-semibold">No addresses found</h2>
              <p className="mt-2 text-gray-500">You haven't added any delivery addresses yet.</p>
              <Button 
                onClick={addNewAddress} 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Add Your First Address
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(address => (
            <Card key={address.id} className={`${address.is_default ? 'border-blue-500 border-2' : 'border'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{address.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      {address.is_default && (
                        <span className="text-blue-600 font-medium flex items-center">
                          <Home className="w-4 h-4 mr-1" />
                          Default Address
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {address.is_default ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">Default</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDefaultAddress(address.id)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <address className="not-italic">
                  <div>{address.address_line1}</div>
                  {address.address_line2 && <div>{address.address_line2}</div>}
                  <div>{`${address.city}, ${address.state} ${address.postal_code}`}</div>
                  <div>{address.country}</div>
                  <div className="mt-2">
                    <span className="text-gray-500">Phone:</span> {address.phone_number}
                  </div>
                </address>

                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editAddress(address)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAddress(address.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for your delivery address
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
            
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(false);
                  setEditingAddress(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingAddress ? "Update Address" : "Save Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
