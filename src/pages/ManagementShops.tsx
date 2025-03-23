
import React, { useEffect, useState } from 'react';
import ShopManagement from '@/components/management/ShopManagement';
import { Helmet } from 'react-helmet';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ManagementShops = () => {
  const isMobile = useIsMobile();
  const [storageInitialized, setStorageInitialized] = useState(false);
  
  useEffect(() => {
    const checkStorage = async () => {
      try {
        // Check if we can access the shops and products buckets
        const { data: shopsBucket, error: shopsError } = await supabase
          .storage
          .getBucket('shops');
          
        const { data: productsBucket, error: productsError } = await supabase
          .storage
          .getBucket('products');
          
        if (!shopsError && !productsError) {
          setStorageInitialized(true);
        } else {
          console.warn('Storage buckets not found, attempting to create them');
          toast.error('Storage buckets need to be set up in Supabase dashboard');
        }
      } catch (error) {
        console.error('Error checking storage buckets:', error);
      }
    };
    
    checkStorage();
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Shop Management | Admin Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Helmet>
      <div className={`w-full overflow-hidden ${isMobile ? 'px-2' : ''}`}>
        {!storageInitialized && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="text-amber-800 font-semibold">Storage Setup Required</h3>
            <p className="text-amber-700 text-sm">
              Please set up 'shops' and 'products' storage buckets in Supabase for image uploads to work correctly.
            </p>
          </div>
        )}
        <ShopManagement />
      </div>
    </>
  );
};

export default ManagementShops;
