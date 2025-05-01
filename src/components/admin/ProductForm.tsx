
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Product } from '@/lib/products/types';
import { createProduct, updateProduct } from '@/lib/supabase/products';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
  onSubmit?: (productData: any) => Promise<any>;
  categories?: any[];
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  isEdit = false, 
  onSubmit: externalOnSubmit,
  categories = []
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      sale_price: product?.sale_price || 0,
      category: product?.category || '',
      stock: product?.stock || 0,
      is_new: product?.is_new || false,
      is_trending: product?.is_trending || false,
      images: product?.images?.[0] || '',
      shop_id: product?.shop_id || '',
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Format the data for the API
      const productData = {
        ...data,
        images: [data.images],
        colors: ['Default'],
        sizes: ['Default'],
        tags: [data.category],
      };
      
      if (externalOnSubmit) {
        await externalOnSubmit(productData);
      } else if (isEdit && product) {
        await updateProduct(product.id, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Product name is required' }}
            render={({ field }) => <Input id="name" {...field} />}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message as string}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                  <SelectItem value="Jeans">Jeans</SelectItem>
                  <SelectItem value="Dresses">Dresses</SelectItem>
                  <SelectItem value="Jackets">Jackets</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Shoes">Shoes</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-red-500">{errors.category.message as string}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field }) => <Textarea id="description" {...field} rows={4} />}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message as string}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Controller
            name="price"
            control={control}
            rules={{ required: 'Price is required', min: { value: 0, message: 'Price must be positive' } }}
            render={({ field }) => <Input id="price" type="number" step="0.01" {...field} />}
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message as string}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sale_price">Sale Price (Optional)</Label>
          <Controller
            name="sale_price"
            control={control}
            render={({ field }) => <Input id="sale_price" type="number" step="0.01" {...field} />}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Controller
            name="stock"
            control={control}
            rules={{ required: 'Stock is required', min: { value: 0, message: 'Stock cannot be negative' } }}
            render={({ field }) => <Input id="stock" type="number" {...field} />}
          />
          {errors.stock && <p className="text-sm text-red-500">{errors.stock.message as string}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="images">Image URL</Label>
          <Controller
            name="images"
            control={control}
            rules={{ required: 'At least one image URL is required' }}
            render={({ field }) => <Input id="images" {...field} />}
          />
          {errors.images && <p className="text-sm text-red-500">{errors.images.message as string}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-2">
          <Controller
            name="is_new"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch 
                id="is_new" 
                checked={value}
                onCheckedChange={onChange}
              />
            )}
          />
          <Label htmlFor="is_new">Mark as New</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Controller
            name="is_trending"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch 
                id="is_trending"
                checked={value}
                onCheckedChange={onChange} 
              />
            )}
          />
          <Label htmlFor="is_trending">Mark as Trending</Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/admin/products')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
