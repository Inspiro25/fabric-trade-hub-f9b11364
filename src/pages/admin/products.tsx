import ProductForm from '@/components/admin/ProductForm';
import { useCategories } from '@/hooks/use-categories';
import { supabase } from '@/lib/supabase';

export default function AdminProducts() {
  const { categories } = useCategories();

  const handleAddProduct = async (productData: any) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <div className="max-w-2xl">
        <ProductForm 
          onSubmit={handleAddProduct}
          categories={categories || []}
        />
      </div>
    </div>
  );
}
