
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shop } from '@/lib/shops';

// Form schema for shop creation/editing
export const shopFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  logo: z.string().url("Must be a valid URL").or(z.string().length(0)).default(''),
  coverImage: z.string().url("Must be a valid URL").or(z.string().length(0)).default(''),
  isVerified: z.boolean().default(false),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  ownerEmail: z.string().email("Must be a valid email address"),
  status: z.enum(['pending', 'active', 'suspended']).default('pending'),
  shopId: z.string().min(4, "Shop ID must be at least 4 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ShopFormValues = z.infer<typeof shopFormSchema>;

interface ShopFormProps {
  initialData?: Shop | null;
  onSubmit: (data: ShopFormValues) => void;
  onCancel: () => void;
  formTitle: string;
  submitLabel: string;
}

const ShopForm: React.FC<ShopFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  formTitle,
  submitLabel,
}) => {
  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      address: initialData.address,
      logo: initialData.logo,
      coverImage: initialData.coverImage,
      isVerified: initialData.isVerified,
      ownerName: initialData.ownerName || '',
      ownerEmail: initialData.ownerEmail || '',
      status: (initialData.status as any) || 'pending',
      shopId: initialData.shopId || '',
      password: '', // We don't display the existing password for security reasons
    } : {
      name: '',
      description: '',
      address: '',
      logo: '/placeholder.svg',
      coverImage: '/placeholder.svg',
      isVerified: false,
      ownerName: '',
      ownerEmail: '',
      status: 'pending',
      shopId: `shop-${Math.floor(Math.random() * 10000)}`,
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter shop description" 
                  className="min-h-[100px]" 
                  {...field} 
                />
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter logo URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter cover image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Input placeholder="Enter owner email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shopId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter shop ID for login" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Used for admin login to the shop portal
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{initialData ? 'New Password' : 'Password'}</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder={initialData ? "Enter new password (leave empty to keep current)" : "Enter shop password"}
                    {...field} 
                  />
                </FormControl>
                {initialData && (
                  <FormDescription>
                    Leave empty to keep the current password
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shop status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Controls how this shop appears on the platform
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                <FormDescription>
                  Mark as a verified shop on the platform
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ShopForm;
