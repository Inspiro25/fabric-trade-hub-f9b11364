
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

// Define form schema
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid number greater than 0",
  }),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Image URL must be a valid URL"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: any) => Promise<any>;
  categories: { id: string; name: string }[];
  initialValues?: ProductFormValues;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  onSubmit, 
  categories, 
  initialValues 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || {
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
    },
  });

  const handleSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const productData = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        category_id: values.category,
        images: [values.imageUrl],
        colors: [],
        sizes: [],
        tags: [],
        stock: 10,
        is_new: true,
      };

      await onSubmit(productData);
      toast.success("Product added successfully!");
      form.reset();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="29.99" {...field} />
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
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
