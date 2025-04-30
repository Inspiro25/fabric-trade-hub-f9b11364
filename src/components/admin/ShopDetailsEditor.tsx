
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Shop, convertToDisplayShop } from '@/lib/shops/types';
import { toast } from 'sonner';
import { Check, Save } from 'lucide-react';
import FileUpload from '@/components/ui/file-upload';
import { updateShop } from '@/lib/supabase/shops';

// Validation schema - using memo to prevent unnecessary re-evaluations
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface ShopDetailsEditorProps {
  shop: Shop;
}

const ShopDetailsEditor: React.FC<ShopDetailsEditorProps> = ({ shop }) => {
  const displayShop = convertToDisplayShop(shop);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState(shop.logo);
  const [coverImage, setCoverImage] = useState(displayShop.coverImage);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shop.name,
      description: shop.description,
      address: shop.address,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const updateData = {
        ...data,
        logo,
        cover_image: coverImage
      };
      
      const success = await updateShop(shop.id, updateData);
      
      if (success) {
        toast.success("Shop details updated successfully");
      } else {
        throw new Error("Failed to update shop details");
      }
    } catch (error) {
      console.error("Error updating shop:", error);
      toast.error("Failed to update shop details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Shop Details</CardTitle>
        <CardDescription>
          Update your shop information that customers will see
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormLabel>Shop Logo</FormLabel>
                <div className="mt-2">
                  <FileUpload
                    initialImage={logo}
                    onUploadComplete={(url) => setLogo(url)}
                    bucketName="shops"
                    folderPath="logos"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload a square logo image for your shop (recommended: 400x400px)
                </p>
              </div>
              
              <div>
                <FormLabel>Cover Image</FormLabel>
                <div className="mt-2">
                  <FileUpload
                    initialImage={coverImage}
                    onUploadComplete={(url) => setCoverImage(url)}
                    bucketName="shops"
                    folderPath="covers"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload a banner image for your shop (recommended: 1200x400px)
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Check className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default React.memo(ShopDetailsEditor);
