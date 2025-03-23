import React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Shop } from '@/lib/shops/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import FileUpload from '@/components/ui/file-upload';

// Schema for form validation
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
  status: 'active' | 'pending' | 'suspended';
  password: string;
  phoneNumber: string;
}

export const shopFormSchema = z.object({
  name: z.string().min(3, { message: 'Shop name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  isVerified: z.boolean().optional(),
  shopId: z.string().optional(),
  ownerName: z.string().min(3, { message: 'Owner name must be at least 3 characters' }),
  ownerEmail: z.string().email({ message: 'Must be a valid email address' }),
  status: z.enum(['active', 'pending', 'suspended']).optional(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).optional(),
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 characters' }),
});

interface ShopFormProps {
  shop?: Shop;
  onSubmit: (data: ShopFormValues) => Promise<void>;
  onCancel: () => void;
  isMobile?: boolean;
}

export const ShopForm: React.FC<ShopFormProps> = ({ 
  shop, 
  onSubmit, 
  onCancel,
  isMobile = false
}) => {
  const [logo, setLogo] = React.useState<string>(shop?.logo || '');
  const [coverImage, setCoverImage] = React.useState<string>(shop?.coverImage || '');

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      name: shop?.name || '',
      description: shop?.description || '',
      address: shop?.address || '',
      isVerified: shop?.isVerified || false,
      shopId: shop?.shopId || '',
      ownerName: shop?.ownerName || '',
      ownerEmail: shop?.ownerEmail || '',
      status: shop?.status || 'pending',
      password: '',  // Don't pre-fill password
      phoneNumber: shop?.phoneNumber || '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleFormSubmit = async (data: ShopFormValues) => {
    // Add the logo and coverImage to the form data
    const formData = {
      ...data,
      logo,
      coverImage,
    };
    
    await onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className={`grid grid-cols-1 ${!isMobile ? 'md:grid-cols-2' : ''} gap-4`}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter shop name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shopId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop ID (for login)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter unique shop ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter shop description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter shop address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={`grid grid-cols-1 ${!isMobile ? 'md:grid-cols-2' : ''} gap-4`}>
          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter owner name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ownerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter owner email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className={`grid grid-cols-1 ${!isMobile ? 'md:grid-cols-2' : ''} gap-4`}>
          <div>
            <FormLabel>Shop Logo</FormLabel>
            <FileUpload
              initialImage={logo}
              onUploadComplete={setLogo}
              bucketName="shops"
              folderPath="logos"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a square logo image for your shop (recommended: 400x400px)
            </p>
          </div>

          <div>
            <FormLabel>Cover Image</FormLabel>
            <FileUpload
              initialImage={coverImage}
              onUploadComplete={setCoverImage}
              bucketName="shops"
              folderPath="covers"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a banner image for your shop (recommended: 1200x400px)
            </p>
          </div>
        </div>

        <div className={`grid grid-cols-1 ${!isMobile ? 'md:grid-cols-2' : ''} gap-4`}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{shop ? 'New Password (leave empty to keep current)' : 'Password'}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={shop ? "Enter new password (optional)" : "Enter password"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isVerified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Verified Shop</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Mark this shop as verified by the platform
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : shop ? 'Update Shop' : 'Create Shop'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
