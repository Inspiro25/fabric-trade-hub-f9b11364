
import React from 'react';
import OffersManagement from '@/components/management/OffersManagement';

const ManagementOffers = () => {
  return (
    <div className="flex-1 p-3 md:p-8 pt-4 md:pt-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Offers</h2>
        <p className="text-muted-foreground">
          Manage promotions and special offers across the platform
        </p>
      </div>
      
      <div className="mt-6">
        <OffersManagement />
      </div>
    </div>
  );
};

export default ManagementOffers;
