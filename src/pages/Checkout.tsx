import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder } from '@/services/orderService';
import { DeliveryAddressDropdown } from '@/components/delivery/DeliveryAddressDropdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Plus, Check, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Address } from '@/types/address';
import { formatCurrency } from '@/lib/utils';

export default function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
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

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login', { state: { returnUrl: '/checkout' } });
    } else {
      fetchAddresses();
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const fetchAddresses = async () => {
    if (!currentUser) return;

    try {
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
    }
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressDialog(false);
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
      fetchAddresses();
      setSelectedAddress(data);
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

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      navigate('/auth/login', { state: { returnUrl: '/checkout' } });
      return;
    }

    if (!selectedAddress) {
      toast({
        title: "No delivery address",
        description: "Please select a delivery address",
        variant: "destructive"
      });
      setShowAddressDialog(true);
      return;
    }

    setIsProcessing(true);
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price,
        color: item.color,
        size: item.size
      }));

      const shippingAddress = {
        name: selectedAddress.name,
        street: selectedAddress.address_line1,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.postal_code,
        phone: selectedAddress.phone_number
      };

      const paymentId = `PAY-${Math.random().toString(36).substr(2, 9)}`;
      const orderId = await createOrder(
        currentUser.id, 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        paymentId, 
        total
      );

      if (orderId) {
        clearCart();
        navigate('/order-success', { state: { orderId } });
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Failed to place order",
        description: "There was an error processing your order, please try again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Map cartItems to match the structure expected by the checkout page
  const items = cartItems.map(item => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    name: item.name,
    image: item.image,
    price: item.price,
    color: item.color || '',
    size: item.size || '',
    total: item.total
  }));

  // Update references from product to the item itself
  const renderCartItems = () => {
    return cartItems.map((item) => (
      <div key={item.id} className="flex py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-md overflow-hidden">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h3>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(item.price)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {item.color && `Color: ${item.color}`} {item.size && `Size: ${item.size}`}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Delivery Address</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressDialog(true)}
                >
                  Change
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAddress ? (
                <div className="flex space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full h-fit">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{selectedAddress.name}</div>
                    <div className="text-gray-600">
                      {selectedAddress.address_line1}
                      {selectedAddress.address_line2 && `, ${selectedAddress.address_line2}`}
                    </div>
                    <div className="text-gray-600">
                      {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
                    </div>
                    <div className="text-gray-600">{selectedAddress.country}</div>
                    <div className="text-gray-600 mt-1">Phone: {selectedAddress.phone_number}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-500">No delivery address selected</p>
                  <Button 
                    className="mt-2 bg-blue-600 hover:bg-blue-700" 
                    onClick={() => setShowAddressDialog(true)}
                  >
                    Add Delivery Address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                defaultValue={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex-1 cursor-pointer">UPI</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {renderCartItems()}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold mt-4 text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handlePlaceOrder}
                disabled={isProcessing || !selectedAddress}
              >
                {isProcessing ? "Processing..." : "Place Order"} 
                {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Address Selection Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Delivery Address</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {!isAddingNew ? (
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
                      onClick={() => handleAddressSelect(address)}
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
                        {selectedAddress?.id === address.id && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
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
                  className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Address
                </Button>
              </div>
            ) : (
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
