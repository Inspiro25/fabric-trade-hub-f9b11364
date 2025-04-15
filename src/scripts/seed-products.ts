
import { supabase } from '../integrations/supabase/client';

// Function to get all shops
async function getShops() {
  const { data: shops, error } = await supabase
    .from('shops')
    .select('id');
  
  if (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
  
  return shops || [];
}

// Function to add products for a shop
async function addProductsForShop(shopId: string) {
  // Generate 10 products for each shop
  for (let i = 1; i <= 10; i++) {
    const product = {
      name: `Product ${shopId}-${i}`,
      description: i % 3 === 0 
        ? 'This premium quality product offers excellent durability and performance.'
        : i % 3 === 1 
          ? 'Handcrafted with attention to detail and made from sustainable materials.' 
          : 'Designed for comfort and style, this product is a must-have for your collection.',
      price: 1000 + (i * 500),
      sale_price: i % 3 === 0 ? 800 + (i * 400) : null,
      images: [
        `https://placehold.co/600x400?text=Shop+${shopId}+Product+${i}`,
        `https://placehold.co/600x400?text=Shop+${shopId}+Product+${i}+Alt`
      ],
      category_id: i % 5 === 0 ? 'clothing'
        : i % 5 === 1 ? 'electronics'
        : i % 5 === 2 ? 'footwear'
        : i % 5 === 3 ? 'accessories'
        : 'home-decor',
      colors: i % 4 === 0 ? ['red', 'blue', 'black']
        : i % 4 === 1 ? ['green', 'yellow', 'white']
        : i % 4 === 2 ? ['purple', 'orange', 'pink']
        : ['gray', 'brown', 'navy'],
      sizes: i % 3 === 0 ? ['S', 'M', 'L', 'XL']
        : i % 3 === 1 ? ['XS', 'S', 'M', 'L']
        : ['M', 'L', 'XL', 'XXL'],
      tags: i % 3 === 0 ? ['trending', 'featured']
        : i % 3 === 1 ? ['new', 'seasonal']
        : ['popular', 'limited-edition'],
      stock: 50 + (i * 10),
      is_new: i <= 3,
      is_trending: i >= 7,
      rating: 3.5 + (i % 3) * 0.5,
      review_count: 10 + (i * 5),
      shop_id: shopId
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert([product]);
      
    if (error) {
      console.error(`Error adding product for shop ${shopId}:`, error);
    } else {
      console.log(`Added product ${i} for shop ${shopId}`);
    }
  }
}

// Main function to seed the database
export async function seedProducts() {
  const shops = await getShops();
  
  if (shops.length === 0) {
    console.log('No shops found. Please add shops first.');
    return;
  }
  
  console.log(`Found ${shops.length} shops. Adding products...`);
  
  // Process shops one by one to avoid rate limits
  for (const shop of shops) {
    await addProductsForShop(shop.id);
    // Short delay to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('Finished adding products!');
}

// Auto-execute if running directly
if (typeof window === 'undefined') {
  seedProducts().catch(console.error);
}
