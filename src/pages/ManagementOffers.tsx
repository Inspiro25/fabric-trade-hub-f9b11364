import React from 'react';
import { Helmet } from 'react-helmet';
import OffersManagement from '@/components/management/OffersManagement';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ManagementOffers = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <Helmet>
        <title>Offers | Management Portal</title>
      </Helmet>
      <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Offers</h2>
            <p className="text-muted-foreground">
              Manage promotions and special offers across the platform
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Offer
          </Button>
        </div>
        
        <div className={isMobile ? "pb-16" : ""}>
          <OffersManagement />
        </div>
      </div>
    </>
  );
};

export default ManagementOffers;
