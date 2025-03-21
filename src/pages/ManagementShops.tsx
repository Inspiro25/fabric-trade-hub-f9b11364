
import React from 'react';
import ShopManagement from '@/components/management/ShopManagement';
import { Helmet } from 'react-helmet';
import { useIsMobile } from '@/hooks/use-mobile';

const ManagementShops = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <Helmet>
        <title>Shop Management | Admin Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      <div className={`w-full overflow-hidden ${isMobile ? 'px-2' : ''}`}>
        <ShopManagement />
      </div>
    </>
  );
};

export default ManagementShops;
