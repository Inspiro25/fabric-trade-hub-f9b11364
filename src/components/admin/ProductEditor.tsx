
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { fetchCategories, createProduct, updateProduct } from '@/lib/supabase/products';
import { Plus, X, Loader } from 'lucide-react';
import { Product } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Form schema for product
const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().min(0, 'Stock must be a positive number').default(0),
  category: z.string().optional(),
  isNew: z.boolean().default(false),
  isTrending: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductEditorProps {
  mode: 'add' | 'edit';
  product?: Product | null;
  shopId: string;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ 
  mode, 
  product, 
  shopId,
  onSave,
  onCancel
}) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [newColor, setNewColor] = useState('');
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [newSize, setNewSize] = useState('');
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      salePrice: product?.salePrice || null,
      stock: product?.stock || 0,
      category: product?.category || '',
      isNew: product?.isNew || false,
      isTrending: product?.isTrending || false,
    },
  });
  
  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };
    
    getCategories();
  }, []);
  
  const handleAddImage = () => {
    if (newImageUrl && !images.includes(newImageUrl)) {
      setImages([...images, newImageUrl]);
      setNewImageUrl('');
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };
  
  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };
  
  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };
  
  const handleRemoveSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };
  
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedImages([...uploadedImages, ...filesArray]);
    }
  };
  
  const uploadImages = async (): Promise<string[]> => {
    if (uploadedImages.length === 0) return images;
    
    setIsUploading(true);
    const uploadedUrls: string[] = [...images];
    
    try {
      // Check if the bucket exists, create it if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      const productBucket = buckets?.find(b => b.name === 'products');
      
      if (!productBucket) {
        await supabase.storage.createBucket('products', {
          public: true
        });
      }
      
      // Upload each image
      for (const file of uploadedImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${shopId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('products')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Error uploading image:', error);
          continue;
        }
        
        const { data: publicUrl } = supabase.storage
          .from('products')
          .getPublicUrl(data.path);
          
        uploadedUrls.push(publicUrl.publicUrl);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error in image upload process:', error);
      toast.error('Some images failed to upload');
      return uploadedUrls;
    } finally {
      setIsUploading(false);
    }
  };
  
  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    
    try {
      const uploadedImageUrls = await uploadImages();
      
      const productData: Omit<Product, 'id'> = {
        name: data.name,
        description: data.description || '',
        price: data.price,
        salePrice: data.salePrice || null,
        images: uploadedImageUrls,
        category: data.category || '',
        shopId: shopId,
        colors: colors,
        sizes: sizes,
        isNew: data.isNew,
        isTrending: data.isTrending,
        stock: data.stock,
        tags: tags,
        rating: product?.rating || 0,
        reviewCount: product?.reviewCount || 0,
      };
      
      if (mode === 'add') {
        const newProductId = await createProduct(productData);
        
        if (newProductId) {
          toast.success('Product created successfully');
          onSave({ id: newProductId, ...productData });
        } else {
          throw new Error('Failed to create product');
        }
      } else if (mode === 'edit' && product) {
        const success = await updateProduct(product.id, productData);
        
        if (success) {
          toast.success('Product updated successfully');
          onSave({ id: product.id, ...productData });
        } else {
          throw new Error('Failed to update product');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{mode === 'add' ? 'Add New Product' : 'Edit Product'}</CardTitle>
        <CardDescription>
          {mode === 'add' 
            ? 'Create a new product for your shop' 
            : 'Update the details of your existing product'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Basic Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="details" className="space-y-4 mt-0">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
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
                          placeholder="Enter product description" 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale Price (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="Enter sale price if on sale"
                            value={field.value === null ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value === '' ? null : parseFloat(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || undefined}
                          value={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.length > 0 ? (
                              categories.map((category) => (
                                <SelectItem 
                                  key={category.id} 
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="uncategorized">Uncategorized</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isNew"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                        <div className="space-y-1">
                          <FormLabel>Mark as New</FormLabel>
                          <FormDescription>
                            Display a "New" badge on this product
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isTrending"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                        <div className="space-y-1">
                          <FormLabel>Mark as Trending</FormLabel>
                          <FormDescription>
                            Show this product in trending sections
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="images" className="space-y-4 mt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Current Images</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Product image ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Add Images</h3>
                    <div className="flex gap-2">
                      <Input
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Image URL"
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleAddImage} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Or upload images directly:</p>
                    <Input 
                      type="file" 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      multiple 
                    />
                    {uploadedImages.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">{uploadedImages.length} images selected for upload</p>
                        <p className="text-xs text-muted-foreground">Images will be uploaded when you save the product</p>
                      </div>
                    )}
                    {isUploading && (
                      <div className="flex items-center text-sm text-amber-600">
                        <Loader className="animate-spin h-3 w-3 mr-2" />
                        Uploading images...
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="variants" className="space-y-6 mt-0">
                {/* Colors */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1"
                      >
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="text-sm">{color}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Add color (e.g. Red, #FF0000)"
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddColor} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
                
                {/* Sizes */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1"
                      >
                        <span className="text-sm">{size}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Add size (e.g. S, M, L, XL, 38, 40)"
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddSize} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tags" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Product Tags</h3>
                  <p className="text-sm text-muted-foreground">
                    Tags help customers find your products and improve search results.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1"
                      >
                        <span className="text-sm">{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag (e.g. summer, casual, cotton)"
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || isUploading}
                >
                  {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === 'add' ? 'Create Product' : 'Update Product'}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductEditor;
