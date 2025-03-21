
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ShopManagementHeaderProps {
  onAddShop: () => void;
}

const ShopManagementHeader: React.FC<ShopManagementHeaderProps> = ({ onAddShop }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Shop Management</h2>
      <Button onClick={onAddShop}>
        <Plus className="mr-2 h-4 w-4" />
        Add New Shop
      </Button>
    </div>
  );
};

export default ShopManagementHeader;
