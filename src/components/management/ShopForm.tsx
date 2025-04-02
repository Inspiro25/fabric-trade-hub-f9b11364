
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shop } from '@/types/shop';

// Define schema for the form
export const shopSchema = z.object({
  name: z.string().min(1, "Shop name is required"),
  description: z.string().min(1, "Description is required"),
  logo: z.string().min(1, "Logo URL is required"),
  coverImage: z.string().min(1, "Cover image URL is required"),
  address: z.string().min(1, "Address is required"),
  isVerified: z.boolean().default(false),
  shopId: z.string().min(1, "Shop ID is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  ownerEmail: z.string().email("Invalid email format").min(1, "Owner email is required"),
  status: z.string().min(1, "Status is required"),
  password: z.string().min(1, "Password is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

// Export the ShopFormValues type so it can be used elsewhere
export type ShopFormValues = z.infer<typeof shopSchema>;

export interface ShopFormProps {
  shop?: Shop;
  onSubmit: (data: ShopFormValues) => Promise<void>;
  onCancel: () => void;
  isMobile?: boolean;
}

export const ShopForm: React.FC<ShopFormProps> = ({ shop, onSubmit, onCancel, isMobile = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : shop ? 'Update Shop' : 'Create Shop'}
        </Button>
      </div>
    </form>
  );
};

export default ShopForm;
