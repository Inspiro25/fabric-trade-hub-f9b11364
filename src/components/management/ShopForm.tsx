import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShopFormValues, shopFormSchema } from '@/types/shop';

const ShopForm = ({
  defaultValues = {},
  onSubmit,
  submitLabel,
  isSubmitting = false
}: ShopFormProps) => {
  const formDefaults: ShopFormValues = {
    name: defaultValues.name || '',
    description: defaultValues.description || '',
    logo: defaultValues.logo || '',
    coverImage: defaultValues.coverImage || '',
    address: defaultValues.address || '',
    isVerified: defaultValues.isVerified || false,
    shopId: defaultValues.shopId || '',
    ownerName: defaultValues.ownerName || '',
    ownerEmail: defaultValues.ownerEmail || '',
    status: defaultValues.status || 'pending',
    password: defaultValues.password || '',
    phoneNumber: defaultValues.phoneNumber || '',
  };

  const { control, handleSubmit, formState: { errors } } = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: formDefaults
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Shop Name</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input id="name" {...field} />}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="shopId">Shop ID</Label>
          <Controller
            name="shopId"
            control={control}
            render={({ field }) => <Input id="shopId" {...field} />}
          />
          {errors.shopId && <p className="text-red-500 text-sm">{errors.shopId.message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Textarea id="description" {...field} />}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="logo">Logo URL</Label>
          <Controller
            name="logo"
            control={control}
            render={({ field }) => <Input id="logo" {...field} />}
          />
          {errors.logo && <p className="text-red-500 text-sm">{errors.logo.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Controller
            name="coverImage"
            control={control}
            render={({ field }) => <Input id="coverImage" {...field} />}
          />
          {errors.coverImage && <p className="text-red-500 text-sm">{errors.coverImage.message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Controller
            name="ownerName"
            control={control}
            render={({ field }) => <Input id="ownerName" {...field} />}
          />
          {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ownerEmail">Owner Email</Label>
          <Controller
            name="ownerEmail"
            control={control}
            render={({ field }) => <Input id="ownerEmail" type="email" {...field} />}
          />
          {errors.ownerEmail && <p className="text-red-500 text-sm">{errors.ownerEmail.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => <Input id="phoneNumber" {...field} />}
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => <Input id="address" {...field} />}
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => <Input id="password" type="password" {...field} />}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>
      
      <div className="flex items-center space-x-2">
        <Controller
          name="isVerified"
          control={control}
          render={({ field }) => (
            <Switch 
              id="isVerified" 
              checked={field.value} 
              onCheckedChange={field.onChange} 
            />
          )}
        />
        <Label htmlFor="isVerified">Verified Shop</Label>
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? 'Submitting...' : submitLabel}
      </Button>
    </form>
  );
};

// Re-export the ShopFormValues interface for use in other components
export type { ShopFormValues };

export default ShopForm;
