
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shop } from '@/lib/shops/types';
import ShopTable from './ShopTable';

interface ShopTabContentProps {
  title: string;
  description: string;
  shops: Shop[];
  isLoading: boolean;
  onEdit: (shop: Shop) => void;
  onDelete: (shopId: string) => void;
  tabValue: string;
  filterCondition?: (shop: Shop) => boolean;
}

const ShopTabContent: React.FC<ShopTabContentProps> = ({
  title,
  description,
  shops,
  isLoading,
  onEdit,
  onDelete,
  tabValue,
  filterCondition,
}) => {
  const filteredShops = filterCondition ? shops.filter(filterCondition) : shops;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ShopTable 
          shops={filteredShops}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
};

export default ShopTabContent;
