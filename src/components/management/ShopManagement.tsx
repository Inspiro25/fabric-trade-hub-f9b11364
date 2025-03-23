
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shop } from '@/lib/shops/types';
import { createShop, updateShop, getShopById } from '@/lib/supabase/shops';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShopFormValues } from '@/components/management/ShopForm';

// Define the schema to match exactly with ShopFormValues
const shopSchema = yup.object({
  name: yup.string().required('Shop name is required'),
  description: yup.string().required('Description is required'),
  logo: yup.string().required('Logo URL is required'),
  coverImage: yup.string().required('Cover image URL is required'),
  address: yup.string().required('Address is required'),
  isVerified: yup.boolean().required(),
  shopId: yup.string().required('Shop ID is required'),
  ownerName: yup.string().required('Owner name is required'),
  ownerEmail: yup.string().email('Invalid email format').required('Owner email is required'),
  status: yup.string().oneOf(['active', 'pending', 'suspended']).required('Status is required'),
  password: yup.string().required('Password is required'),
  phoneNumber: yup.string().required('Phone number is required'),
});

type ShopSchemaType = yup.InferType<typeof shopSchema>;

const ShopManagement: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [shopData, setShopData] = useState<Shop | null>(null);
  const shopId = sessionStorage.getItem('adminShopId');
  const isMobile = useIsMobile();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShopFormValues>({
    resolver: yupResolver<ShopSchemaType>(shopSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      coverImage: '',
      address: '',
      isVerified: false,
      shopId: '',
      ownerName: '',
      ownerEmail: '',
      status: 'pending',
      password: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    const fetchShopData = async () => {
      if (shopId) {
        const shop = await getShopById(shopId);
        if (shop) {
          setShopData(shop);
          setValue('name', shop.name);
          setValue('description', shop.description);
          setValue('logo', shop.logo);
          setValue('coverImage', shop.coverImage);
          setValue('address', shop.address);
          setValue('isVerified', shop.isVerified);
          setValue('shopId', shop.shopId || '');
          setValue('ownerName', shop.ownerName);
          setValue('ownerEmail', shop.ownerEmail);
          setValue('status', shop.status);
          setValue('password', shop.password || '');
          setValue('phoneNumber', shop.phoneNumber || '');
        } else {
          toast.error('Shop not found');
          navigate('/admin/login');
        }
      }
    };

    fetchShopData();
  }, [shopId, setValue, navigate]);

  const submitForm = async (data: ShopFormValues) => {
    try {
      setIsSubmitting(true);
    
      const shopData: Omit<Shop, 'id'> = {
        name: data.name,
        description: data.description,
        logo: data.logo,
        coverImage: data.coverImage,
        address: data.address,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        phoneNumber: data.phoneNumber, 
        status: data.status as 'active' | 'pending' | 'suspended',
        isVerified: data.isVerified || false,
        rating: 0,
        reviewCount: 0,
        followers: 0,
        followers_count: 0,
        productIds: [],
        createdAt: new Date().toISOString(),
        shopId: data.shopId || `shop-${Math.floor(Math.random() * 10000)}`,
        password: data.password,
      };
    
      if (shopId) {
        const success = await updateShop(shopId, shopData);
        if (success) {
          toast.success('Shop updated successfully');
        } else {
          toast.error('Failed to update shop');
        }
      } else {
        const newShopId = await createShop(shopData);
        if (newShopId) {
          toast.success('Shop created successfully');
          navigate(`/admin/dashboard`);
        } else {
          toast.error('Failed to create shop');
        }
      }
    } catch (error) {
      console.error('Error creating/updating shop:', error);
      toast.error('An unexpected error occurred');
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
      <form onSubmit={handleSubmit(submitForm)} className="max-w-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Shop Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input id="name" {...field} type="text" placeholder="Enter shop name" />
              )}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="shopId">Shop ID</Label>
            <Controller
              name="shopId"
              control={control}
              render={({ field }) => (
                <Input id="shopId" {...field} type="text" placeholder="Enter shop ID" />
              )}
            />
            {errors.shopId && <p className="text-red-500 text-sm">{errors.shopId.message}</p>}
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea id="description" {...field} placeholder="Enter shop description" />
            )}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Controller
              name="logo"
              control={control}
              render={({ field }) => (
                <Input id="logo" {...field} type="url" placeholder="Enter logo URL" />
              )}
            />
            {errors.logo && <p className="text-red-500 text-sm">{errors.logo.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Controller
              name="coverImage"
              control={control}
              render={({ field }) => (
                <Input id="coverImage" {...field} type="url" placeholder="Enter cover image URL" />
              )}
            />
            {errors.coverImage && <p className="text-red-500 text-sm">{errors.coverImage.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ownerName">Owner Name</Label>
            <Controller
              name="ownerName"
              control={control}
              render={({ field }) => (
                <Input id="ownerName" {...field} type="text" placeholder="Enter owner name" />
              )}
            />
            {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="ownerEmail">Owner Email</Label>
            <Controller
              name="ownerEmail"
              control={control}
              render={({ field }) => (
                <Input id="ownerEmail" {...field} type="email" placeholder="Enter owner email" />
              )}
            />
            {errors.ownerEmail && <p className="text-red-500 text-sm">{errors.ownerEmail.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input id="phoneNumber" {...field} type="tel" placeholder="Enter phone number" />
              )}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input id="address" {...field} type="text" placeholder="Enter address" />
              )}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input id="password" {...field} type="password" placeholder="Enter password" />
              )}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Controller
            name="isVerified"
            control={control}
            render={({ field }) => (
              <Switch id="isVerified" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="isVerified">Is Verified</Label>
          {errors.isVerified && <p className="text-red-500 text-sm">{errors.isVerified.message}</p>}
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? 'Submitting...' : shopId ? 'Update Shop' : 'Create Shop'}
        </Button>
      </form>
    </div>
  );
};

export default ShopManagement;
