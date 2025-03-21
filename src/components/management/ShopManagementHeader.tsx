
import React from 'react';
import { Button } from '@/components/ui/button';
import { Store, PlusCircle } from 'lucide-react';

interface ShopManagementHeaderProps {
  onAddShop: () => void;
}

const ShopManagementHeader: React.FC<ShopManagementHeaderProps> = ({ onAddShop }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Shop Management</h2>
        <p className="text-muted-foreground mt-1">
          Manage shops registered on the platform
        </p>
      </div>
      <Button 
        className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700" 
        onClick={onAddShop}
        size="lg"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add New Shop
      </Button>
    </div>
  );
};

export default ShopManagementHeader;
