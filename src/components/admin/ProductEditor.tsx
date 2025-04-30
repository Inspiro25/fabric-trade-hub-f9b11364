import React, { useState, useEffect, useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, ChevronsUpDown, Plus, X, Loader2, ImagePlus, Tag as TagIcon, Palette, Ruler, Save, Upload } from "lucide-react";
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { debounce } from 'lodash';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/products/types';
import { createProduct, updateProduct, fetchCategories } from '@/lib/supabase/products';

// Validation schema
const formSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_.,&]+$/, "Name can only contain letters, numbers, spaces, and basic punctuation"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters"),
  price: z.string()
    .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid number greater than 0",
    })
    .refine(val => Number(val) <= 1000000, {
      message: "Price must not exceed 1,000,000",
  }),
  salePrice: z.string()
    .refine(val => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
    message: "Sale price must be a valid number",
    })
    .refine(val => val === '' || Number(val) <= 1000000, {
      message: "Sale price must not exceed 1,000,000",
    })
    .optional(),
  category: z.string().min(1, "Category is required"),
  stock: z.string()
    .refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a valid number",
    })
    .refine(val => Number(val) <= 10000, {
      message: "Stock must not exceed 10,000 units",
  }),
  isNew: z.boolean().default(false),
  isTrending: z.boolean().default(false),
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
  const [productImages, setProductImages] = useState<string[]>(
    product?.images || []
  );
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newTag, setNewTag] = useState('');
  const [colorError, setColorError] = useState('');
  const [sizeError, setSizeError] = useState('');
  const [tagError, setTagError] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [commonSizes, setCommonSizes] = useState<string[]>([]);
  const [commonTags, setCommonTags] = useState<string[]>([]);
  const [showCommonSizes, setShowCommonSizes] = useState(false);
  const [showCommonTags, setShowCommonTags] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product ? String(product.price) : '',
      salePrice: product?.salePrice ? String(product.salePrice) : '',
      category: product?.category || '',
      stock: product ? String(product.stock) : '',
      isNew: product?.isNew || mode === 'add',
      isTrending: product?.isTrending || false,
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const categoriesData = await fetchCategories();
        console.log('Categories loaded in component:', categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Load common sizes and tags
  useEffect(() => {
    const loadCommonData = async () => {
      try {
        // In a real app, you might fetch these from an API
        setCommonSizes(['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', '5XL']);
        setCommonTags(['New Arrival', 'Best Seller', 'Limited Edition', 'Sale', 'Trending', 'Popular', 'Featured']);
      } catch (error) {
        console.error('Error loading common data:', error);
      }
    };
    
    loadCommonData();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (productImages.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }
    
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
        images: productImages,
        colors,
        sizes,
        tags,
        rating: product?.rating || 4.0,
        reviewCount: product?.reviewCount || 0,
        isNew: data.isNew, 
        isTrending: data.isTrending,
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

  // Validate color input
  const validateColor = (color: string) => {
    if (!color) {
      setColorError('Color name is required');
      return false;
    }
    if (colors.includes(color)) {
      setColorError('This color already exists');
      return false;
    }
    if (color.length > 30) {
      setColorError('Color name is too long');
      return false;
    }
    setColorError('');
    return true;
  };
  
  // Validate size input
  const validateSize = (size: string) => {
    if (!size) {
      setSizeError('Size is required');
      return false;
    }
    if (sizes.includes(size)) {
      setSizeError('This size already exists');
      return false;
    }
    if (size.length > 10) {
      setSizeError('Size is too long');
      return false;
    }
    setSizeError('');
    return true;
  };
  
  // Validate tag input
  const validateTag = (tag: string) => {
    if (!tag) {
      setTagError('Tag is required');
      return false;
    }
    if (tags.includes(tag)) {
      setTagError('This tag already exists');
      return false;
    }
    if (tag.length > 30) {
      setTagError('Tag is too long');
      return false;
    }
    setTagError('');
    return true;
  };
  
  // Add color with validation
  const addColor = () => {
    if (validateColor(newColor)) {
      setColors([...colors, newColor]);
      setNewColor('');
      setShowColorPicker(false);
    }
  };

  // Add size with validation
  const addSize = () => {
    if (validateSize(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  // Add tag with validation
  const addTag = () => {
    if (validateTag(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  // Add common size
  const addCommonSize = (size: string) => {
    if (!sizes.includes(size)) {
      setSizes([...sizes, size]);
    }
  };
  
  // Add common tag
  const addCommonTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };
  
  // Remove color
  const removeColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
  };
  
  // Remove size
  const removeSize = (size: string) => {
    setSizes(sizes.filter(s => s !== size));
  };
  
  // Remove tag
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  // Handle color picker change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
    setNewColor(e.target.value);
  };

  // Add this function to generate preview data
  const getPreviewData = () => {
    const formData = form.getValues();
    return {
      name: formData.name || "Product Name",
      description: formData.description || "Product Description",
      price: formData.price ? Number(formData.price) : 0,
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      images: productImages,
      category: categories.find(c => c.id === formData.category)?.name || "Category",
      colors,
      sizes,
      stock: formData.stock ? Number(formData.stock) : 0,
      isNew: formData.isNew,
      isTrending: formData.isTrending,
      tags,
    };
  };

  // Auto-save function
  const autoSave = useCallback(
    debounce(async (data: FormValues) => {
      try {
        const formattedData = {
          name: data.name,
          description: data.description,
          price: Number(data.price),
          salePrice: data.salePrice && data.salePrice !== '' ? Number(data.salePrice) : undefined,
          stock: Number(data.stock),
          category: data.category,
          shopId,
          images: productImages,
          colors,
          sizes,
          tags,
          isNew: data.isNew,
          isTrending: data.isTrending,
        };

        if (mode === 'edit' && product) {
          const success = await updateProduct(product.id, formattedData);
          if (success) {
            setLastSaved(new Date());
            setIsDirty(false);
            toast.success('Draft saved');
          }
        }
      } catch (error) {
        console.error('Error auto-saving:', error);
        toast.error('Failed to save draft');
      }
    }, 2000),
    [mode, product, shopId, productImages, colors, sizes, tags]
  );

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (mode === 'edit') {
        setIsDirty(true);
        autoSave(data as FormValues);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, mode, autoSave]);

  // Add unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length + productImages.length > 6) {
      toast.error('Maximum 6 images allowed');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = acceptedFiles.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', `shop-${shopId}`);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        setUploadProgress(((index + 1) / acceptedFiles.length) * 100);
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setProductImages([...productImages, ...uploadedUrls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [productImages.length, shopId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
        <CardTitle>{mode === 'add' ? 'Add New Product' : 'Edit Product'}</CardTitle>
        <CardDescription>
          {mode === 'add' 
            ? 'Fill in the details to add a new product to your shop inventory'
            : 'Update the product details in your inventory'
          }
        </CardDescription>
          </div>
          {mode === 'edit' && lastSaved && (
            <div className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
              {isDirty && <span className="ml-2 text-yellow-500">(Unsaved changes)</span>}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
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
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoadingCategories}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-categories" disabled>
                              No categories available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
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
                        <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                          <Input placeholder="299" {...field} />
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
                        <FormLabel>Sale Price (₹)</FormLabel>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isNew"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Mark as New</FormLabel>
                      <FormDescription className="text-xs">
                        Highlight this product as newly added
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Mark as Trending</FormLabel>
                      <FormDescription className="text-xs">
                        Feature this product in trending sections
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
            
            <div>
              <FormLabel>Product Images</FormLabel>
              <div className="mt-2">
                    <div
                      {...getRootProps()}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                        isDragActive ? "border-primary bg-primary/5" : "border-gray-300",
                        isUploading && "pointer-events-none opacity-50"
                      )}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div className="text-sm text-gray-600">
                          {isDragActive ? (
                            <p>Drop the images here...</p>
                          ) : (
                            <p>Drag & drop images here, or click to select files</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Maximum 6 images, up to 5MB each
                        </p>
                      </div>
                    </div>

                    {isUploading && (
                      <div className="mt-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                />
              </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Uploading... {Math.round(uploadProgress)}%
                        </p>
                      </div>
                    )}

                    {productImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {productImages.map((image, index) => (
                          <div key={index} className="relative group aspect-square">
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setProductImages(images => images.filter((_, i) => i !== index));
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {index === 0 && (
                              <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded-full">
                                Main
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Colors Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Colors
                      </FormLabel>
            </div>
            
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                  <Input 
                    placeholder="Add a color" 
                    value={newColor}
                            onChange={(e) => {
                              setNewColor(e.target.value);
                              validateColor(e.target.value);
                            }}
                            className={colorError ? "border-red-500" : ""}
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <input 
                              type="color" 
                              value={selectedColor}
                              onChange={handleColorChange}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={addColor}
                          disabled={!!colorError}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                      {colorError && <p className="text-sm text-red-500">{colorError}</p>}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                        <div key={color} className="group flex items-center bg-gray-100 px-3 py-1.5 rounded-md text-sm">
                          <div 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ 
                              backgroundColor: color.startsWith('#') ? color : 'transparent',
                              border: color.startsWith('#') ? 'none' : '1px solid #ccc'
                            }}
                          />
                          <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                            className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                      {colors.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No colors added yet</p>
                      )}
                </div>
              </div>
              
                  {/* Sizes Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center gap-2">
                        <Ruler className="h-4 w-4" />
                        Sizes
                      </FormLabel>
                    </div>
                    
                    <div className="space-y-2">
                      <Select onValueChange={(value) => {
                        if (value && !sizes.includes(value)) {
                          setSizes([...sizes, value]);
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a size" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonSizes.map((size) => (
                            <SelectItem 
                              key={size} 
                              value={size}
                              disabled={sizes.includes(size)}
                            >
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                </div>
                    
                    <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                        <div key={size} className="group flex items-center bg-gray-100 px-3 py-1.5 rounded-md text-sm">
                          <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                            className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                      {sizes.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No sizes selected yet</p>
                      )}
                </div>
              </div>
              
                  {/* Tags Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center gap-2">
                        <TagIcon className="h-4 w-4" />
                        Tags
                      </FormLabel>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex gap-2">
                  <Input 
                    placeholder="Add a tag" 
                    value={newTag}
                          onChange={(e) => {
                            setNewTag(e.target.value);
                            validateTag(e.target.value);
                          }}
                          className={tagError ? "border-red-500" : ""}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={addTag}
                          disabled={!!tagError}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                      {tagError && <p className="text-sm text-red-500">{tagError}</p>}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                        <div key={tag} className="group flex items-center bg-gray-100 px-3 py-1.5 rounded-md text-sm">
                          <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                            className="ml-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                      {tags.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No tags added yet</p>
                      )}
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
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {productImages.length > 0 ? (
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <img
                        src={productImages[0]}
                        alt={getPreviewData().name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No image uploaded</span>
                    </div>
                  )}
                  {productImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {productImages.slice(1).map((image, index) => (
                        <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`${getPreviewData().name} ${index + 2}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{getPreviewData().name}</h2>
                    <p className="text-gray-500">{getPreviewData().category}</p>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">₹{getPreviewData().price.toFixed(2)}</span>
                    {getPreviewData().salePrice && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          ₹{getPreviewData().salePrice.toFixed(2)}
                        </span>
                        <span className="text-green-600">
                          {Math.round((1 - getPreviewData().salePrice / getPreviewData().price) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-gray-600">{getPreviewData().description}</p>
                  </div>
                  
                  {colors.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Colors</h3>
                      <div className="flex flex-wrap gap-2">
                        {colors.map(color => (
                          <div key={color} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ 
                                backgroundColor: color.startsWith('#') ? color : 'transparent',
                                border: color.startsWith('#') ? 'none' : '1px solid #ccc'
                              }}
                            />
                            <span className="text-sm">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {sizes.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Sizes</h3>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                          <span key={size} className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Stock</span>
                      <p className="font-semibold">{getPreviewData().stock} units</p>
                    </div>
                    {getPreviewData().isNew && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                        New
                      </span>
                    )}
                    {getPreviewData().isTrending && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                        Trending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
};

export default ProductEditor;
