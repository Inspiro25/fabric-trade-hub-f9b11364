
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ShopAdminHeader from '@/components/admin/ShopAdminHeader';
import { Shop } from '@/lib/shops/types';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Ban } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  const [shopData, setShopData] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const shopId = sessionStorage.getItem('adminShopId');
    if (!shopId) {
      navigate('/admin/login');
      return;
    }
    
    fetchShopData(shopId);
  }, [navigate]);
  
  const fetchShopData = async (shopId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching shop data:', error);
        toast.error('Failed to load shop data');
        setIsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const shop: Shop = {
          id: data[0].id,
          name: data[0].name || '',
          description: data[0].description || '',
          logo: data[0].logo || '/placeholder.svg',
          coverImage: data[0].cover_image || '/placeholder.svg',
          address: data[0].address || '',
          ownerName: data[0].owner_name || '',
          ownerEmail: data[0].owner_email || '',
          phoneNumber: data[0].phone_number || '', // Correct mapping here
          rating: data[0].rating || 0,
          reviewCount: data[0].review_count || 0,
          followers: data[0].followers_count || 0,
          productIds: [],
          isVerified: data[0].is_verified || false,
          status: (data[0].status as 'active' | 'pending' | 'suspended') || 'pending',
          createdAt: data[0].created_at,
          shopId: data[0].shop_id || '',
          followers_count: data[0].followers_count || 0,
        };
        setShopData(shop);
      } else {
        toast.error('Shop not found');
        navigate('/admin/login');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchShopData:', error);
      toast.error('An error occurred while loading shop data');
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  
  if (!shopData) {
    return <div className="text-center mt-10">Shop data not available.</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <ShopAdminHeader shop={shopData} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Shop Status</CardTitle>
            <CardDescription>Overview of your shop's current status.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            {shopData.status === 'active' && (
              <>
                <CheckCircle className="text-green-500 h-6 w-6 mr-2" />
                <span>Your shop is active and visible to customers.</span>
              </>
            )}
            {shopData.status === 'pending' && (
              <>
                <AlertTriangle className="text-yellow-500 h-6 w-6 mr-2" />
                <span>Your shop is pending approval.</span>
              </>
            )}
            {shopData.status === 'suspended' && (
              <>
                <Ban className="text-red-500 h-6 w-6 mr-2" />
                <span>Your shop is currently suspended.</span>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Check if your shop is verified.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            {shopData.isVerified ? (
              <>
                <CheckCircle className="text-green-500 h-6 w-6 mr-2" />
                <span>Your shop is verified.</span>
              </>
            ) : (
              <>
                <AlertTriangle className="text-yellow-500 h-6 w-6 mr-2" />
                <span>Your shop is not yet verified.</span>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your shop with these quick actions.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => navigate('/admin/products')}>Manage Products</Button>
            <Button onClick={() => navigate('/admin/settings')}>Shop Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
