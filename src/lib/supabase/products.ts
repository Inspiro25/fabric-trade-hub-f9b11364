import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/products";

// Function to fetch all products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    if (!products) return [];
    
    return products.map((product: any) => ({
      id: product?.id || '',
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      salePrice: product?.sale_price,
      images: product?.images || [],
      category: product?.category_id || '',
      colors: product?.colors || [],
      sizes: product?.sizes || [],
      isNew: product?.is_new || false,
      isTrending: product?.is_trending || false,
      rating: product?.rating || 0,
      reviewCount: product?.review_count || 0,
      stock: product?.stock || 0,
      tags: product?.tags || [],
      shopId: product?.shop_id || '',
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return undefined;
    }
    
    if (!product) return undefined;
    
    return {
      id: product?.id || '',
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      salePrice: product?.sale_price,
      images: product?.images || [],
      category: product?.category_id || '',
      colors: product?.colors || [],
      sizes: product?.sizes || [],
      isNew: product?.is_new || false,
      isTrending: product?.is_trending || false,
      rating: product?.rating || 0,
      reviewCount: product?.review_count || 0,
      stock: product?.stock || 0,
      tags: product?.tags || [],
      shopId: product?.shop_id || '',
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return undefined;
  }
};

// Get products by shop ID
export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);
    
    if (error) {
      console.error(`Error fetching products for shop ${shopId}:`, error);
      return [];
    }
    
    if (!products) return [];
    
    return products.map((product: any) => ({
      id: product?.id || '',
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      salePrice: product?.sale_price,
      images: product?.images || [],
      category: product?.category_id || '',
      colors: product?.colors || [],
      sizes: product?.sizes || [],
      isNew: product?.is_new || false,
      isTrending: product?.is_trending || false,
      rating: product?.rating || 0,
      reviewCount: product?.review_count || 0,
      stock: product?.stock || 0,
      tags: product?.tags || [],
      shopId: product?.shop_id || '',
    }));
  } catch (error) {
    console.error(`Error fetching products for shop ${shopId}:`, error);
    return [];
  }
};

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<string | null> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        sale_price: productData.salePrice,
        images: productData.images,
        category_id: productData.category,
        shop_id: productData.shopId,
        colors: productData.colors,
        sizes: productData.sizes,
        is_new: productData.isNew,
        is_trending: productData.isTrending,
        stock: productData.stock,
        tags: productData.tags,
      } as any)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

// Update a product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        sale_price: productData.salePrice,
        images: productData.images,
        category_id: productData.category,
        colors: productData.colors,
        sizes: productData.sizes,
        is_new: productData.isNew,
        is_trending: productData.isTrending,
        stock: productData.stock,
        tags: productData.tags,
      } as any)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize 'products' table in Supabase client type
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    console.log('Fetching categories from Supabase...');
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, description, image')
      .order('name');
      
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    console.log('Categories fetched:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to fetching from local categories if available
    return [];
  }
};

// Update the product images for the vyoma-clothing shop
export const updateVyomaClothingImages = async (): Promise<boolean> => {
  try {
    // Get the shop ID for vyoma-clothing
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .select('id')
      .eq('name', 'Vyoma Clothing')
      .single();
    
    if (shopError || !shopData) {
      console.error('Error finding Vyoma Clothing shop:', shopError);
      return false;
    }
    
    const shopId = shopData.id;
    
    // Get all products for this shop
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .eq('shop_id', shopId);
    
    if (productsError || !products) {
      console.error('Error fetching products for Vyoma Clothing:', productsError);
      return false;
    }
    
    // Define high-quality fashion images for products
    const fashionImages = {
      'Casual T-Shirt': [
        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&auto=format&fit=crop'
      ],
      'Slim Fit Jeans': [
        'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1529391409740-59f2cea08bc6?w=800&auto=format&fit=crop'
      ],
      'Summer Dress': [
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop'
      ],
      'Leather Jacket': [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541085388148-a162d19bf842?w=800&auto=format&fit=crop'
      ],
      'Sport Sneakers': [
        'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&auto=format&fit=crop'
      ],
      'Winter Coat': [
        'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop'
      ],
      'Silk Blouse': [
        'https://images.unsplash.com/photo-1626557981101-aae6f84aa6ff?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&auto=format&fit=crop'
      ],
      'Casual Shorts': [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1593431074633-21ef64707d29?w=800&auto=format&fit=crop'
      ]
    };
    
    // Default images for products without specific matches
    const defaultImages = [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=800&auto=format&fit=crop'
    ];
    
    // Update each product with appropriate images
    for (const product of products) {
      let imagesToUse;
      
      // Use name-specific images if available, otherwise use default
      Object.keys(fashionImages).forEach(keyName => {
        if (product.name.toLowerCase().includes(keyName.toLowerCase())) {
          imagesToUse = fashionImages[keyName as keyof typeof fashionImages];
        }
      });
      
      if (!imagesToUse) {
        imagesToUse = defaultImages;
      }
      
      // Update the product with new images
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          images: imagesToUse
        })
        .eq('id', product.id);
      
      if (updateError) {
        console.error(`Error updating product ${product.id}:`, updateError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating Vyoma Clothing product images:', error);
    return false;
  }
};
