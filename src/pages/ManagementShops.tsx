
import React from 'react';
import ShopManagement from '@/components/management/ShopManagement';
import { Helmet } from 'react-helmet';

const ManagementShops = () => {
  return (
    <>
      <Helmet>
        <title>Shop Management | Admin Portal</title>
      </Helmet>
      <ShopManagement />
    </>
  );
};

export default ManagementShops;
