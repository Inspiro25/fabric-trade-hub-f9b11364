
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { updateShop } from '@/lib/supabase/shops';
import { Shop, convertToDisplayShop } from '@/lib/shops/types';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import FileUpload from '@/components/ui/file-upload';

interface ShopSettingsProps {
  shop: Shop;
  onUpdateSuccess?: () => void;
}

const ShopSettings: React.FC<ShopSettingsProps> = ({ shop, onUpdateSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const displayShop = convertToDisplayShop(shop);
  const [logo, setLogo] = useState<string>(shop.logo || '');
  const [coverImage, setCoverImage] = useState<string>(displayShop.coverImage || '');
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: shop.name,
      description: shop.description,
      address: shop.address,
      phoneNumber: displayShop.phoneNumber || '',
      ownerName: displayShop.ownerName,
      ownerEmail: displayShop.ownerEmail,
      password: '',
      isVerified: displayShop.isVerified
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Update shop data with new logo/cover if changed
      const updateData = {
        ...data,
        logo,
        cover_image: coverImage,
        phone_number: data.phoneNumber,
        owner_name: data.ownerName,
        owner_email: data.ownerEmail,
        is_verified: data.isVerified
      };
      
      const success = await updateShop(shop.id, updateData);
      
      if (success) {
        toast.success('Shop settings updated successfully');
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        toast.error('Failed to update shop settings');
      }
    } catch (error) {
      console.error('Error updating shop:', error);
      toast.error('An error occurred while updating settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={cn(
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle>Shop Settings</CardTitle>
          <CardDescription>
            Update your shop information and appearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Shop Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter shop name" 
                  {...register("name", { required: "Shop name is required" })}
                  className={cn(
                    errors.name && "border-red-500",
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white"
                  )}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                  id="phoneNumber" 
                  placeholder="Enter phone number" 
                  {...register("phoneNumber")}
                  className={cn(
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white"
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Enter shop description" 
                {...register("description", { required: "Description is required" })}
                className={cn(
                  errors.description && "border-red-500",
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white"
                )}
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message as string}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                placeholder="Enter shop address" 
                {...register("address", { required: "Address is required" })}
                className={cn(
                  errors.address && "border-red-500",
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white"
                )}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message as string}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input 
                  id="ownerName" 
                  placeholder="Enter owner name" 
                  {...register("ownerName", { required: "Owner name is required" })}
                  className={cn(
                    errors.ownerName && "border-red-500",
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white"
                  )}
                />
                {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ownerEmail">Owner Email</Label>
                <Input 
                  id="ownerEmail" 
                  placeholder="Enter owner email" 
                  {...register("ownerEmail", { 
                    required: "Owner email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email address"
                    }
                  })}
                  className={cn(
                    errors.ownerEmail && "border-red-500",
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white"
                  )}
                />
                {errors.ownerEmail && <p className="text-red-500 text-sm">{errors.ownerEmail.message as string}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">New Password (leave empty to keep current)</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter new password (optional)" 
                {...register("password")}
                className={cn(
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white"
                )}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card className={cn(
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      )}>
        <CardHeader>
          <CardTitle>Shop Appearance</CardTitle>
          <CardDescription>
            Update your shop logo and cover image
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="logo">Shop Logo</Label>
              <FileUpload
                initialImage={logo}
                onUploadComplete={setLogo}
                bucketName="shops"
                folderPath="logos"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Upload a square logo image for your shop (recommended: 400x400px)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image</Label>
              <FileUpload
                initialImage={coverImage}
                onUploadComplete={setCoverImage}
                bucketName="shops"
                folderPath="covers"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Upload a banner image for your shop (recommended: 1200x400px)
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting} 
            className="w-full md:w-auto mt-4"
          >
            {isSubmitting ? "Saving..." : "Update Appearance"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopSettings;
