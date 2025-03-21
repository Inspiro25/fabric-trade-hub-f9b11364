
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Heart, Store, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ProfileActionsProps = {
  onLogout: () => Promise<void>;
};

const ProfileActions = ({ onLogout }: ProfileActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>
        <ShoppingBag className="mr-2 h-4 w-4" />
        My Orders
      </Button>
      
      <Button variant="outline" className="w-full" onClick={() => navigate('/wishlist')}>
        <Heart className="mr-2 h-4 w-4" />
        Wishlist
      </Button>
      
      <Button variant="outline" className="w-full" onClick={() => navigate('/admin/login')}>
        <Store className="mr-2 h-4 w-4" />
        Shop Login
      </Button>
      
      <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default ProfileActions;
