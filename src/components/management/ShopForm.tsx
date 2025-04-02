
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shop } from '@/types/shop';

// Define ShopFormValues type
export interface ShopFormValues {
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  isVerified: boolean;
  shopId: string;
  ownerName: string;
  ownerEmail: string;
  status: string;
  password: string;
  phoneNumber: string;
}

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
  status: yup.string().required('Status is required'),
  password: yup.string().required('Password is required'),
  phoneNumber: yup.string().required('Phone number is required'),
});

interface ShopFormProps {
  shop?: Shop;
  onSubmit: (data: ShopFormValues) => Promise<void>;
  onCancel: () => void;
  isMobile?: boolean;
}

export const ShopForm: React.FC<ShopFormProps> = ({ shop, onSubmit, onCancel, isMobile = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ShopFormValues>({
    resolver: yupResolver(shopSchema),
    defaultValues: {
      name: shop?.name || '',
      description: shop?.description || '',
      logo: shop?.logo || '',
      coverImage: shop?.coverImage || '',
      address: shop?.address || '',
      isVerified: shop?.isVerified || false,
      shopId: shop?.shopId || '',
      ownerName: shop?.ownerName || '',
      ownerEmail: shop?.ownerEmail || '',
      status: shop?.status || 'pending',
      password: shop?.password || '',
      phoneNumber: shop?.phoneNumber || '',
    },
  });

  const submitForm = async (data: ShopFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
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
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : shop ? 'Update Shop' : 'Create Shop'}
        </Button>
      </div>
    </form>
  );
};
