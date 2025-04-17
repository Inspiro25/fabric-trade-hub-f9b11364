
import React from 'react';
import { Helmet } from 'react-helmet';
import PartnerRequestsTable from '@/components/management/PartnerRequestsTable';

const ManagementPartners = () => {
  return (
    <>
      <Helmet>
        <title>Partner Requests | Admin Portal</title>
      </Helmet>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Partner Requests</h2>
            <p className="text-muted-foreground">
              Manage partnership requests from businesses interested in joining the platform
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <PartnerRequestsTable />
        </div>
      </div>
    </>
  );
};

export default ManagementPartners;
