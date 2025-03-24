
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Shop } from '@/lib/shops/types';
import { updateShop } from '@/lib/supabase/shops';
import { Loader } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const shopSettingsSchema = z.object({
  name: z.string().min(2, { message: "Shop name must be at least 2 characters." }),
  description: z.string().optional(),
  logo: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  coverImage: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  ownerName: z.string().optional(),
  ownerEmail: z.string().email({ message: "Please enter a valid email" }).optional().or(z.literal('')),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional().or(z.literal('')),
});

type ShopSettingsFormValues = z.infer<typeof shopSettingsSchema>;

interface ShopSettingsProps {
  shop: Shop;
  onUpdateSuccess?: () => void;
}

const ShopSettings: React.FC<ShopSettingsProps> = ({ shop, onUpdateSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const form = useForm<ShopSettingsFormValues>({
    resolver: zodResolver(shopSettingsSchema),
    defaultValues: {
      name: shop.name || '',
      description: shop.description || '',
      logo: shop.logo || '',
      coverImage: shop.cover_image || '',
      ownerName: shop.owner_name || '',
      ownerEmail: shop.owner_email || '',
      phoneNumber: shop.phone_number || '',
      address: shop.address || '',
      password: '',
    },
  });
  
  const uploadImage = async (file: File, path: string): Promise<string> => {
    try {
      // Check if shops bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const shopsBucket = buckets?.find(b => b.name === 'shops');
      
      if (!shopsBucket) {
        await supabase.storage.createBucket('shops', {
          public: true
        });
      }
      
      // Upload the file
      const fileExt = file.name.split('.').pop();
      const fileName = `${shop.id}/${path}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('shops')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: publicUrl } = supabase.storage
        .from('shops')
        .getPublicUrl(data.path);
      
      return publicUrl.publicUrl;
    } catch (error) {
      console.error(`Error uploading ${path} image:`, error);
      toast.error(`Failed to upload ${path} image`);
      throw error;
    }
  };
  
  const onSubmit = async (data: ShopSettingsFormValues) => {
    setIsLoading(true);
    
    try {
      let logoUrl = data.logo;
      let coverImageUrl = data.coverImage;
      
      // Upload logo if a new one was selected
      if (logoFile) {
        logoUrl = await uploadImage(logoFile, 'logo');
      }
      
      // Upload cover image if a new one was selected
      if (coverFile) {
        coverImageUrl = await uploadImage(coverFile, 'cover');
      }
      
      const updatedShopData = {
        name: data.name,
        description: data.description,
        logo: logoUrl,
        cover_image: coverImageUrl,
        owner_name: data.ownerName,
        owner_email: data.ownerEmail,
        phone_number: data.phoneNumber,
        address: data.address,
      };
      
      // Only include password if it was provided
      if (data.password) {
        Object.assign(updatedShopData, { password: data.password });
      }
      
      // Update the shop in the database
      await updateShop(shop.id, updatedShopData);
      
      toast.success('Shop settings updated successfully');
      
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      console.error('Error updating shop settings:', error);
      toast.error('Failed to update shop settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };
  
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop Settings</CardTitle>
        <CardDescription>Manage your shop details and information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="basic" className="m-0">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shop Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your shop name" {...field} />
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
                            placeholder="Tell customers about your shop..."
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description of your shop and what you offer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="branding" className="m-0">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          You can provide a URL or upload a new image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Upload New Logo</FormLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="mt-1"
                      />
                      {logoFile && (
                        <p className="text-xs text-green-600 mt-1">
                          New logo selected: {logoFile.name}
                        </p>
                      )}
                    </div>
                    
                    {shop.logo && (
                      <div className="flex items-center">
                        <div className="w-16 h-16 overflow-hidden rounded-md">
                          <img 
                            src={shop.logo} 
                            alt="Current logo" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-500">Current Logo</span>
                      </div>
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          A banner image to display at the top of your shop page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <FormLabel>Upload New Cover Image</FormLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="mt-1"
                      />
                      {coverFile && (
                        <p className="text-xs text-green-600 mt-1">
                          New cover image selected: {coverFile.name}
                        </p>
                      )}
                    </div>
                    
                    {shop.cover_image && (
                      <div>
                        <span className="text-sm text-gray-500">Current Cover Image:</span>
                        <div className="w-full h-24 overflow-hidden rounded-md mt-1">
                          <img 
                            src={shop.cover_image} 
                            alt="Current cover" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="m-0">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner/Manager Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Used for order notifications and customer inquiries
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} />
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
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="123 Main St, City, Country" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="m-0">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Update Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="New password (leave blank to keep current)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a new password to change your login credentials
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="border p-4 rounded-md bg-yellow-50">
                    <h3 className="text-sm font-medium text-amber-800">Security Information</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      For enhanced security measures such as two-factor authentication, please contact the platform administrator.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ShopSettings;
