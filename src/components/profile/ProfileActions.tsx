
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, CreditCard, Settings, Heart, ShoppingCart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileActionsProps {
  className?: string;
}

export default function ProfileActions({ className }: ProfileActionsProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Link to="/account/orders">
        <Button variant="outline" className="w-full justify-start text-left" size="lg">
          <Clock className="mr-2 h-5 w-5" /> My Orders
        </Button>
      </Link>
      
      <Link to="/account/addresses">
        <Button variant="outline" className="w-full justify-start text-left" size="lg">
          <MapPin className="mr-2 h-5 w-5" /> Manage Addresses
        </Button>
      </Link>
      
      <Link to="/account/wishlist">
        <Button variant="outline" className="w-full justify-start text-left" size="lg">
          <Heart className="mr-2 h-5 w-5" /> Wishlist
        </Button>
      </Link>
      
      <Link to="/cart">
        <Button variant="outline" className="w-full justify-start text-left" size="lg">
          <ShoppingCart className="mr-2 h-5 w-5" /> Cart
        </Button>
      </Link>
      
      <Link to="/account/settings">
        <Button variant="outline" className="w-full justify-start text-left" size="lg">
          <Settings className="mr-2 h-5 w-5" /> Settings
        </Button>
      </Link>
      
      <Button 
        variant="outline" 
        className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50" 
        size="lg"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-5 w-5" /> Logout
      </Button>
    </div>
  );
}
