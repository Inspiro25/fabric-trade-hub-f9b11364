import React from 'react';
import OffersManagement from '@/components/management/OffersManagement';
import { useIsMobile } from '@/hooks/use-mobile';

const ManagementOffers = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex-1 p-3 md:p-8 pt-4 md:pt-6">
      <div className="flex flex-col gap-2 mb-4 md:mb-6">
        <h2 className="text-xl md:text-3xl font-bold tracking-tight">Offers</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage promotions and special offers across the platform
        </p>
      </div>
      
      <div className={isMobile ? "pb-16" : ""}>
        <OffersManagement />
      </div>
    </div>
  );
};

export default ManagementOffers;
