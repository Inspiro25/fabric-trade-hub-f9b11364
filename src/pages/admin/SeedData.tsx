
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function SeedData() {
  const [isLoading, setIsLoading] = useState(false);

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
        name: `Product ${i} - Shop ${shopId.substring(0, 4)}`,
        description: i % 3 === 0 
          ? 'This premium quality product offers excellent durability and performance.'
          : i % 3 === 1 
            ? 'Handcrafted with attention to detail and made from sustainable materials.' 
            : 'Designed for comfort and style, this product is a must-have for your collection.',
        price: 1000 + (i * 500),
        sale_price: i % 3 === 0 ? 800 + (i * 400) : null,
        images: [
          `https://placehold.co/600x400?text=Shop+${shopId.substring(0, 4)}+Product+${i}`,
          `https://placehold.co/600x400?text=Shop+${shopId.substring(0, 4)}+Product+${i}+Alt`
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
      
      const { error } = await supabase
        .from('products')
        .insert([product]);
        
      if (error) {
        console.error(`Error adding product for shop ${shopId}:`, error);
        throw error;
      }
    }
  }

  // Main function to seed the database
  const seedProducts = async () => {
    setIsLoading(true);
    try {
      const shops = await getShops();
      
      if (shops.length === 0) {
        toast({
          title: "No shops found",
          description: "Please add shops first before seeding products.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Seeding started",
        description: `Adding products for ${shops.length} shops. This may take a moment...`
      });
      
      // Process shops one by one to avoid rate limits
      for (const shop of shops) {
        await addProductsForShop(shop.id);
        // Short delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast({
        title: "Seeding complete",
        description: `Successfully added products for ${shops.length} shops.`
      });
    } catch (error) {
      console.error('Error seeding products:', error);
      toast({
        title: "Seeding failed",
        description: "An error occurred while adding products. See console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Seed Database</CardTitle>
          <CardDescription>
            Add 10 detailed products for each shop in the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={seedProducts} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Database...
              </>
            ) : (
              'Seed Products'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
