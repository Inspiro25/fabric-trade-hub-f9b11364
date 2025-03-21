
import { useState, useEffect } from 'react';
import { 
  getNewArrivals, 
  getTrendingProducts, 
  getAllCategories, 
  getTopRatedProducts, 
  getDiscountedProducts, 
  getBestSellingProducts,
  Product
} from '@/lib/products';

interface HomeDataState {
  newArrivals: Product[];
  trendingProducts: Product[];
  topRatedProducts: Product[];
  discountedProducts: Product[];
  bestSellers: Product[];
  categories: string[];
  isLoading: boolean;
  dataLoaded: {
    categories: boolean;
    newArrivals: boolean;
    bestSellers: boolean;
    topRated: boolean;
    discounted: boolean;
  };
}

export function useHomeData() {
  const [state, setState] = useState<HomeDataState>({
    newArrivals: [],
    trendingProducts: [],
    topRatedProducts: [],
    discountedProducts: [],
    bestSellers: [],
    categories: [],
    isLoading: true,
    dataLoaded: {
      categories: false,
      newArrivals: false,
      bestSellers: false,
      topRated: false,
      discounted: false
    }
  });

  useEffect(() => {
    // This function will fetch data progressively to improve perceived performance
    const fetchData = async () => {
      try {
        // First priority - categories and new arrivals
        const [categoriesData, newArrivalsData] = await Promise.all([
          getAllCategories(),
          getNewArrivals()
        ]);
        
        setState(prev => ({
          ...prev,
          categories: categoriesData,
          newArrivals: newArrivalsData,
          dataLoaded: {...prev.dataLoaded, categories: true, newArrivals: true}
        }));
        
        // Second priority - trending and best sellers
        const [trendingData, bestSellersData] = await Promise.all([
          getTrendingProducts(),
          getBestSellingProducts()
        ]);
        
        setState(prev => ({
          ...prev,
          trendingProducts: trendingData,
          bestSellers: bestSellersData,
          dataLoaded: {...prev.dataLoaded, bestSellers: true}
        }));
        
        // Lower priority - load other data
        const [topRatedData, discountedData] = await Promise.all([
          getTopRatedProducts(),
          getDiscountedProducts()
        ]);
        
        setState(prev => ({
          ...prev,
          topRatedProducts: topRatedData,
          discountedProducts: discountedData,
          dataLoaded: {...prev.dataLoaded, topRated: true, discounted: true},
          isLoading: false
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setState(prev => ({...prev, isLoading: false}));
      }
    };
    
    fetchData();
  }, []);

  return state;
}
