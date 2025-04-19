import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategoriesWithDetails } from '@/lib/products/categories';
import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/use-categories';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

// Default category images from Unsplash - updated with more diverse and appropriate images
const defaultCategoryImages = {
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60',
  'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60',
  'Home & Kitchen': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&auto=format&fit=crop&q=60',
  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60',
  'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=60',
  'Books': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&auto=format&fit=crop&q=60',
  'Toys': 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500&auto=format&fit=crop&q=60',
  'Health': 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&auto=format&fit=crop&q=60',
  'Automotive': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&auto=format&fit=crop&q=60',
  'Jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=60',
  'Pet Supplies': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=60',
  'Office Products': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format&fit=crop&q=60',
  'Clothing': 'https://images.unsplash.com/photo-1441984904996-e0b6be687e04?w=500&auto=format&fit=crop&q=60',
  'Shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60',
  'Accessories': 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&auto=format&fit=crop&q=60',
  'Furniture': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=500&auto=format&fit=crop&q=60',
  'Decor': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&auto=format&fit=crop&q=60',
  'Appliances': 'https://images.unsplash.com/photo-1581093458791-9f3c3250a8b7?w=500&auto=format&fit=crop&q=60',
  'Grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
  'Baby': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&auto=format&fit=crop&q=60',
  'Kids': 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&auto=format&fit=crop&q=60',
  'Men': 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&auto=format&fit=crop&q=60',
  'Women': 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&auto=format&fit=crop&q=60',
  'Gadgets': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
  'Computers': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
  'Mobile': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
  'Cameras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60',
  'Audio': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60',
  'Gaming': 'https://images.unsplash.com/photo-1542751371-adc3849a7e23?w=500&auto=format&fit=crop&q=60',
  'Musical Instruments': 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&auto=format&fit=crop&q=60',
  'Art Supplies': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=60',
  'Craft Supplies': 'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=500&auto=format&fit=crop&q=60',
  'Tools': 'https://images.unsplash.com/photo-1581147036324-c1c1c1c1c1c1?w=500&auto=format&fit=crop&q=60',
  'Hardware': 'https://images.unsplash.com/photo-1581147036324-c1c1c1c1c1c1?w=500&auto=format&fit=crop&q=60',
  'Garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop&q=60',
  'Outdoor': 'https://images.unsplash.com/photo-1501691223387-dd0500403074?w=500&auto=format&fit=crop&q=60',
  'Travel': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60',
  'Luggage': 'https://images.unsplash.com/photo-1545072957-9a5e35b7d5d7?w=500&auto=format&fit=crop&q=60',
  'Watches': 'https://images.unsplash.com/photo-1523192191133-d3e6888e07d9?w=500&auto=format&fit=crop&q=60',
  'Eyewear': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60',
  'Watches2': 'https://images.unsplash.com/photo-1523192191133-d3e6888e07d9?w=500&auto=format&fit=crop&q=60',
  'Eyewear2': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60',
  'Watches3': 'https://images.unsplash.com/photo-1523192191133-d3e6888e07d9?w=500&auto=format&fit=crop&q=60',
  'Eyewear3': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60',
};

const HomeCategoryGrid = ({ categories: propCategories }) => {
  const { categories: hookCategories, loading, error } = useCategories();
  const { isDarkMode } = useTheme();
  
  // Use provided categories or hook categories
  const categories = propCategories || hookCategories;

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-lg" />
      ))}
    </div>
  );
  
  if (error) return <div>Error loading categories</div>;

  // Get default image for a category name
  const getDefaultImage = (categoryName) => {
    // Try to find a matching key in defaultCategoryImages
    const matchingKey = Object.keys(defaultCategoryImages).find(key => 
      categoryName.toLowerCase().includes(key.toLowerCase())
    );
    
    return matchingKey ? defaultCategoryImages[matchingKey] : defaultCategoryImages['Electronics'];
  };

  // Ensure we don't use the same image twice
  const usedImages = new Set();
  const getUniqueImage = (categoryName) => {
    const defaultImage = getDefaultImage(categoryName);
    
    // If this image hasn't been used yet, use it
    if (!usedImages.has(defaultImage)) {
      usedImages.add(defaultImage);
      return defaultImage;
    }
    
    // Otherwise, find an unused image
    for (const [key, image] of Object.entries(defaultCategoryImages)) {
      if (!usedImages.has(image)) {
        usedImages.add(image);
        return image;
      }
    }
    
    // If all images have been used, just return the default
    return defaultImage;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
        {categories.slice(0, 6).map((category) => (
        <Link
          key={category.id}
          to={`/categories/${category.id}`}
            className={cn(
              "group relative overflow-hidden rounded-lg transition-all duration-300",
              isDarkMode 
                ? "bg-gray-800 hover:bg-gray-700" 
                : "bg-gray-50 hover:bg-gray-100"
            )}
          >
            <div className="aspect-[4/3] relative">
              <img
                src={category.image_url || getUniqueImage(category.name)}
                alt={category.name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <h3 className="text-sm font-medium text-white truncate">{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {categories.length > 6 && (
        <div className="mt-3 text-center">
          <Link 
            to="/categories" 
            className={cn(
              "inline-flex items-center text-sm font-medium",
              isDarkMode 
                ? "text-blue-400 hover:text-blue-300" 
                : "text-blue-500 hover:text-blue-600"
            )}
          >
            View all categories
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
          </div>
      )}
    </div>
  );
};

export default HomeCategoryGrid;
