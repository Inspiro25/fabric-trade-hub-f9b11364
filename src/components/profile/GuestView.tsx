
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ShoppingBag, Store, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type GuestViewProps = {
  isLoaded: boolean;
};

const GuestView = ({ isLoaded }: GuestViewProps) => {
  const navigate = useNavigate();

  return (
    <div className={`max-w-md mx-auto p-4 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="bg-blue-50 rounded-full p-6">
          <User className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="text-xl font-medium">Sign in to your account</h2>
        <p className="text-gray-500">Login to view your profile, manage orders, and track your purchases</p>
        
        <div className="w-full space-y-4 mt-4">
          <Button 
            className="w-full" 
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/auth?register=true')}
          >
            Create Account
          </Button>
        </div>
      </div>
      
      <div className="mt-8 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Guest Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <ShoppingBag className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Cart syncing</p>
                  <p className="text-xs text-gray-500">Your cart will sync to your account when you sign in</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Store className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Shop access</p>
                  <p className="text-xs text-gray-500">Browse products and add them to cart</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Heart className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Save favorites</p>
                  <p className="text-xs text-gray-500">Create a wishlist to save items for later</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuestView;
