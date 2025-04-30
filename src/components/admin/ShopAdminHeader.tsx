
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import { Shop, convertToDisplayShop } from '@/lib/shops/types';
import { toast } from 'sonner';

interface ShopAdminHeaderProps {
  shop: Shop;
  isMobile?: boolean;
}

const ShopAdminHeader: React.FC<ShopAdminHeaderProps> = ({ shop, isMobile = false }) => {
  const navigate = useNavigate();
  const displayShop = convertToDisplayShop(shop);
  
  const handleLogout = () => {
    sessionStorage.removeItem('adminShopId');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to Home</span>
        </Button>
        
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={shop.logo} alt={shop.name} />
            <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className={`font-semibold ${isMobile ? 'text-base' : 'text-xl'}`}>
              {shop.name} {displayShop.isVerified && '✓'}
            </h1>
            <p className="text-xs text-muted-foreground">Shop Admin Panel</p>
          </div>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        <span className={isMobile ? 'sr-only' : ''}>Logout</span>
      </Button>
    </div>
  );
};

export default ShopAdminHeader;
