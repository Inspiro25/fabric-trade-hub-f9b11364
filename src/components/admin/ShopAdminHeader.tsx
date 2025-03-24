
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, LayoutDashboard, LogOut } from 'lucide-react';
import { Shop } from '@/lib/shops/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ShopAdminHeaderProps {
  shop: Shop;
  isMobile?: boolean;
}

const ShopAdminHeader: React.FC<ShopAdminHeaderProps> = ({ shop, isMobile = false }) => {
  const handleLogout = () => {
    // Clear admin shop ID from session storage
    sessionStorage.removeItem('adminShopId');
    window.location.href = '/admin/login';
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
      <div className="flex items-center gap-3">
        {shop.logo ? (
          <img 
            src={shop.logo} 
            alt={shop.name} 
            className="w-12 h-12 rounded-full object-cover border" 
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border">
            <span className="text-lg font-semibold text-gray-500">
              {shop.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{shop.name}</h1>
            <Badge 
              variant={shop.status === 'active' ? 'success' : shop.status === 'pending' ? 'outline' : 'destructive'}
              className={cn(
                "text-xs px-2 py-0",
                shop.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                shop.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                'bg-red-100 text-red-800 hover:bg-red-100'
              )}
            >
              {shop.status}
            </Badge>
            {shop.is_verified && (
              <Badge 
                className="text-xs px-2 py-0 bg-blue-100 text-blue-800 hover:bg-blue-100"
              >
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Admin Dashboard
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <Link to={`/shop/${shop.id}`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="h-9">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Shop
          </Button>
        </Link>
        
        <Link to="/admin/dashboard">
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="h-9">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          onClick={handleLogout}
          className="h-9 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ShopAdminHeader;
