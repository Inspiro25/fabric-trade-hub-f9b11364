
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShopFormValues } from '@/components/management/ShopForm';
import ShopForm from '@/components/management/ShopForm';
import { Shop } from '@/lib/shops/types';
import { createShop, updateShop, getShopById } from '@/lib/supabase/shops';

const ShopManagement: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [shopData, setShopData] = useState<Shop | null>(null);
  const shopId = sessionStorage.getItem('adminShopId');
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchShopData = async () => {
      if (shopId) {
        try {
          const shop = await getShopById(shopId);
          if (shop) {
            setShopData(shop);
          } else {
            toast.error('Shop not found');
            navigate('/admin/login');
          }
        } catch (error) {
          console.error('Error fetching shop data:', error);
          toast.error('Failed to fetch shop data');
          navigate('/admin/login');
        }
      }
    };

    fetchShopData();
  }, [shopId, navigate]);

  const submitForm = async (data: ShopFormValues) => {
    setIsSubmitting(true);
    try {
      if (shopId) {
        // Update existing shop
        const updateData: Partial<Shop> = {
          name: data.name,
          description: data.description,
          logo: data.logo,
          cover_image: data.coverImage,
          address: data.address,
          is_verified: data.isVerified,
          shop_id: data.shopId,
          owner_name: data.ownerName,
          owner_email: data.ownerEmail,
          status: data.status,
          password: data.password,
          phone_number: data.phoneNumber,
        };
        
        const success = await updateShop(shopId, updateData);
        if (success) {
          toast.success('Shop updated successfully');
          navigate('/admin/dashboard');
        } else {
          toast.error('Failed to update shop');
        }
      } else {
        // Create new shop
        const newShopData: Omit<Shop, 'id' | 'rating' | 'review_count' | 'followers_count' | 'created_at'> = {
          name: data.name,
          description: data.description,
          logo: data.logo,
          cover_image: data.coverImage,
          address: data.address,
          is_verified: data.isVerified,
          shop_id: data.shopId,
          owner_name: data.ownerName,
          owner_email: data.ownerEmail,
          status: data.status,
          password: data.password,
          phone_number: data.phoneNumber,
          updated_at: new Date().toISOString(),
        };
        
        const newShopId = await createShop(newShopData);
        if (newShopId) {
          toast.success('Shop created successfully');
          navigate('/admin/dashboard');
        } else {
          toast.error('Failed to create shop');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full mb-4"
        onClick={() => navigate('/admin/dashboard')}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back to Dashboard</span>
      </Button>
      
      <h1 className="text-2xl font-semibold mb-4">
        {shopId ? 'Edit Shop' : 'Create Shop'}
      </h1>
      
      {shopData && shopId ? (
        <ShopForm
          defaultValues={{
            name: shopData.name,
            description: shopData.description || '',
            logo: shopData.logo || '',
            coverImage: shopData.cover_image || '',
            address: shopData.address || '',
            isVerified: shopData.is_verified || false,
            shopId: shopData.shop_id || '',
            ownerName: shopData.owner_name || '',
            ownerEmail: shopData.owner_email || '',
            status: shopData.status || 'pending',
            password: shopData.password || '',
            phoneNumber: shopData.phone_number || '',
          }}
          onSubmit={submitForm}
          submitLabel={shopId ? 'Update Shop' : 'Create Shop'}
          isSubmitting={isSubmitting}
        />
      ) : !shopId ? (
        <ShopForm
          onSubmit={submitForm}
          submitLabel="Create Shop"
          isSubmitting={isSubmitting}
        />
      ) : (
        <div className="flex justify-center items-center py-12">
          <p>Loading shop data...</p>
        </div>
      )}
    </div>
  );
};

export default ShopManagement;
