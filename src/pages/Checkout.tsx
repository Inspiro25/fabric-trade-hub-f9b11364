import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Safely access properties from our updated ExtendedUser type
      setAddress(
        currentUser.address || 
        (currentUser.user_metadata && currentUser.user_metadata.address) || 
        ''
      );
      setPhone(
        currentUser.phone || 
        (currentUser.user_metadata && currentUser.user_metadata.phone) || 
        ''
      );
    }
  }, [currentUser]);

  const handlePlaceOrder = () => {
    if (!address || !phone) {
      toast.error('Please provide both address and phone number.');
      return;
    }

    if (cart && cart.length === 0) {
      toast.error('Your cart is empty. Add items to place an order.');
      return;
    }

    // Simulate order placement
    setTimeout(() => {
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
    }, 1500);
  };

  const renderCartItems = () => {
    return cart?.map((item) => (
      <div key={item.id} className="flex items-center justify-between py-2">
        <div className="flex items-center space-x-4">
          <img
            src={item.image || '/placeholder.png'}
            alt={item.name || "Product"}
            className="w-16 h-16 object-cover rounded"
          />
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-muted-foreground">
              Quantity: {item.quantity}
              {item.color && ` · Color: ${item.color}`}
              {item.size && ` · Size: ${item.size}`}
            </p>
            <p className="text-sm font-medium">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto mt-8">
        <div className="bg-white shadow-md rounded-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Order Placed!</h2>
          <p className="text-gray-600">Thank you for your order. We'll process it soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white shadow-md rounded-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
            Address
          </label>
          <Input
            type="text"
            id="address"
            placeholder="Enter your address"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number
          </label>
          <Input
            type="tel"
            id="phone"
            placeholder="Enter your phone number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        {cart && cart.length > 0 ? (
          renderCartItems()
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}

        <div className="mt-6">
          <p className="text-lg font-semibold">
            Total: {formatCurrency(cart?.reduce((total, item) => total + item.price * item.quantity, 0) || 0)}
          </p>
        </div>

        <div className="mt-6">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
