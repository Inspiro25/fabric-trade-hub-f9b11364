import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Product, createProduct, updateProduct } from '@/lib/products';
import { Save, X, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid number greater than 0",
  }),
  salePrice: z.string().refine(val => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
    message: "Sale price must be a valid number",
  }).optional(),
  category: z.string().min(1, "Category is required"),
  stock: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a valid number",
  }),
  mainImage: z.string().url("Main image must be a valid URL"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductEditorProps {
  mode: 'add' | 'edit';
  product: Product | null;
  shopId: string;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ mode, product, shopId, onSave, onCancel }) => {
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    product?.images.slice(1) || []
  );
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product ? String(product.price) : '',
      salePrice: product?.salePrice ? String(product.salePrice) : '',
      category: product?.category || '',
      stock: product ? String(product.stock) : '',
      mainImage: product?.images[0] || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Convert string values to numbers
      const formattedData = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        salePrice: data.salePrice && data.salePrice !== '' ? Number(data.salePrice) : undefined,
        stock: Number(data.stock),
        category: data.category,
        shopId,
        images: [data.mainImage, ...additionalImages.filter(img => img.trim() !== '')],
        colors,
        sizes,
        tags,
        rating: product?.rating || 4.0,
        reviewCount: product?.reviewCount || 0,
        isNew: product?.isNew || mode === 'add', // Mark as new if adding
      };
      
      let result;
      
      if (mode === 'add') {
        // Create new product in database
        const productId = await createProduct(formattedData);
        if (productId) {
          result = { ...formattedData, id: productId };
          toast.success('Product created successfully');
        } else {
          toast.error('Failed to create product');
          setIsSubmitting(false);
          return;
        }
      } else if (product) {
        // Update existing product
        const success = await updateProduct(product.id, formattedData);
        if (success) {
          result = { ...formattedData, id: product.id };
          toast.success('Product updated successfully');
        } else {
          toast.error('Failed to update product');
          setIsSubmitting(false);
          return;
        }
      }
      
      onSave(result);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('An error occurred while saving the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
    }
  };

  const removeColor = (colorToRemove: string) => {
    setColors(colors.filter(color => color !== colorToRemove));
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(size => size !== sizeToRemove));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addImageUrl = () => {
    setAdditionalImages([...additionalImages, '']);
  };

  const updateImageUrl = (index: number, value: string) => {
    const updatedImages = [...additionalImages];
    updatedImages[index] = value;
    setAdditionalImages(updatedImages);
  };

  const removeImageUrl = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'add' ? 'Add New Product' : 'Edit Product'}</CardTitle>
        <CardDescription>
          {mode === 'add' 
            ? 'Fill in the details to add a new product to your shop inventory'
            : 'Update the product details in your inventory'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product category" {...field} />
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
                    <Textarea 
                      placeholder="Enter product description" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="29.99" {...field} />
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
                    <FormLabel>Sale Price ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormField
                control={form.control}
                name="mainImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Additional Images</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setAdditionalImages([...additionalImages, '']);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Image
                  </Button>
                </div>
                
                {additionalImages.map((url, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      value={url}
                      onChange={(e) => {
                        const updatedImages = [...additionalImages];
                        updatedImages[index] = e.target.value;
                        setAdditionalImages(updatedImages);
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => {
                        const updatedImages = additionalImages.filter((_, i) => i !== index);
                        setAdditionalImages(updatedImages);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FormLabel>Colors</FormLabel>
                <div className="flex gap-2 mt-2">
                  <Input 
                    placeholder="Add a color" 
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                      if (newColor && !colors.includes(newColor)) {
                        setColors([...colors, newColor]);
                        setNewColor('');
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {colors.map(color => (
                    <div key={color} className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-xs">
                      {color}
                      <button
                        type="button"
                        onClick={() => {
                          setColors(colors.filter(c => c !== color));
                        }}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <FormLabel>Sizes</FormLabel>
                <div className="flex gap-2 mt-2">
                  <Input 
                    placeholder="Add a size" 
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                      if (newSize && !sizes.includes(newSize)) {
                        setSizes([...sizes, newSize]);
                        setNewSize('');
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {sizes.map(size => (
                    <div key={size} className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-xs">
                      {size}
                      <button
                        type="button"
                        onClick={() => {
                          setSizes(sizes.filter(s => s !== size));
                        }}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <FormLabel>Tags</FormLabel>
                <div className="flex gap-2 mt-2">
                  <Input 
                    placeholder="Add a tag" 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                      if (newTag && !tags.includes(newTag)) {
                        setTags([...tags, newTag]);
                        setNewTag('');
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map(tag => (
                    <div key={tag} className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-xs">
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          setTags(tags.filter(t => t !== tag));
                        }}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting 
                  ? (mode === 'add' ? 'Creating...' : 'Saving...') 
                  : (mode === 'add' ? 'Add Product' : 'Save Changes')
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductEditor;

