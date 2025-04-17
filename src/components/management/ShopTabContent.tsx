
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  isMobile?: boolean;
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
  isMobile = false
}) => {
  // Apply filter condition if provided
  const filteredShops = filterCondition
    ? shops.filter(filterCondition)
    : shops;

  return (
    <Card className="overflow-hidden">
      <CardHeader className={isMobile ? "p-4" : ""}>
        <CardTitle className={isMobile ? "text-lg" : ""}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className={isMobile ? "px-0 pb-0 overflow-x-auto" : "p-6 pt-0"}>
        <div className={isMobile ? "min-w-full w-max" : ""}>
          <ShopTable
            shops={filteredShops}
            isLoading={isLoading}
            onEdit={onEdit}
            onDelete={onDelete}
            isMobile={isMobile}
          />
        </div>
      </div>
    </Card>
  );
};

export default ShopTabContent;
