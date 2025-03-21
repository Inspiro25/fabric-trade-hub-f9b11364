
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ShopManagementHeaderProps {
  onAddShop: () => void;
  isMobile?: boolean;
}

const ShopManagementHeader: React.FC<ShopManagementHeaderProps> = ({ 
  onAddShop,
  isMobile = false 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 mb-4">
      <div>
        <h2 className={`text-xl md:text-3xl font-bold tracking-tight ${isMobile ? 'text-center w-full' : ''}`}>
          Shop Management
        </h2>
        <p className={`text-sm text-muted-foreground ${isMobile ? 'text-center' : ''}`}>
          Manage shop listings, verify new shops, and handle shop information
        </p>
      </div>
      <Button 
        onClick={onAddShop}
        className={isMobile ? "w-full justify-center mt-2" : ""}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Shop
      </Button>
    </div>
  );
};

export default ShopManagementHeader;
