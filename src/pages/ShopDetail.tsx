import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShopById, getShopProducts } from '@/lib/shops';
import { Product } from '@/lib/types/product';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGrid from '@/components/features/ProductGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Shop } from '@/lib/shops/types';
import ShopReviewsTab from '@/components/reviews/ShopReviewsTab';
import { followShop, unfollowShop, isFollowingShop, getShopFollowers } from '@/services/shopFollowService';
import { useTheme } from '@/contexts/ThemeContext';
import ShopDetailHeader from '@/components/shop/ShopDetailHeader';
import ShopDetailCard from '@/components/shop/ShopDetailCard';
import ShopActions from '@/components/shop/ShopActions';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingBag, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/search/AuthDialog';

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  const [isFollowing, setIsFollowing] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSupabaseAuthenticated, currentUser } = useAuth();

  // Fetch shop data and check follow status
  const fetchShopData = useCallback(async () => {
    if (!id) {
      setError("Shop ID is missing");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching shop data for ID:", id);
      const shopData = await getShopById(id);
      console.log("Fetched shop data:", shopData ? "Success" : "Failed");
      
      if (!shopData) {
        setError("Shop not found");
        setIsLoading(false);
        return;
      }
      
      setShop(shopData);
      
      // Fetch shop products
      console.log("Fetching shop products...");
      const productsData = await getShopProducts(id);
      console.log("Fetched products:", productsData.length);
      setShopProducts(productsData);
      
      // Check follow status if user is logged in
      await checkFollowStatus(shopData.id);
      
      // Get followers count
      console.log("Fetching followers...");
      const followers = await getShopFollowers(shopData.id);
      console.log("Followers count:", followers.length);
      setFollowersCount(followers.length);
    } catch (error) {
      console.error('Error fetching shop data:', error);
      setError("Failed to load shop details. Please try again.");
      toast.error("Failed to load shop details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Check if the user is following this shop
  const checkFollowStatus = useCallback(async (shopId: string) => {
    if (isSupabaseAuthenticated && currentUser) {
      try {
        console.log("User is authenticated with Supabase, checking follow status...");
        const following = await isFollowingShop(shopId);
        console.log("User follow status:", following);
        setIsFollowing(following);
      } catch (error) {
        console.error("Error checking follow status:", error);
        // Don't show an error toast for this - it's not critical to the user experience
      }
    } else {
      // If not authenticated, they're definitely not following
      setIsFollowing(false);
    }
  }, [isSupabaseAuthenticated, currentUser]);

  // Effect to fetch shop data on component mount or when auth status changes
  useEffect(() => {
    fetchShopData();
  }, [fetchShopData, isSupabaseAuthenticated]);

  const handleFollow = async () => {
    if (!isSupabaseAuthenticated || !currentUser) {
      setShowAuthDialog(true);
      return;
    }

    if (!shop) {
      toast.error("Shop information not available");
      return;
    }

    try {
      setIsFollowLoading(true);
      if (isFollowing) {
        await unfollowShop(shop.id);
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
        toast.success('Unfollowed shop successfully');
      } else {
        await followShop(shop.id);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        toast.success('Following shop successfully');
      }
    } catch (error: any) {
      console.error('Error following/unfollowing shop:', error);
      
      // More specific error message
      if (error.message === 'User not authenticated') {
        toast.error('Please log in to follow shops');
        setShowAuthDialog(true);
      } else if (error.code === '23503') {
        toast.error('User profile not found. Please try again later.');
      } else {
        toast.error('Failed to follow/unfollow shop. Please try again.');
      }
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleLogin = async () => {
    setShowAuthDialog(false);
    // After login, check follow status again
    if (shop) {
      await checkFollowStatus(shop.id);
    }
  };

  const handleShare = async () => {
    if (!shop) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out ${shop.name} on Kutuku`,
          text: shop.description,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Shop link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Unable to share shop details");
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-orange-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-orange-500' : 'border-orange-500'}`}></div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className={`container mx-auto px-4 py-6 text-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-orange-50'}`}>
        <h2 className="text-lg font-bold mb-3">{error || "Shop not found"}</h2>
        <p className="mb-4 text-sm">The shop you're looking for doesn't exist or couldn't be loaded.</p>
        <Link to="/shops" className={`px-4 py-2 rounded text-white ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'}`}>
          Back to Shops
        </Link>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-orange-50'}`}>
      <ShopDetailHeader isDarkMode={isDarkMode} />
      
      <div className="container mx-auto px-4 -mt-2">
        <div className="relative">
          <ShopDetailCard 
            shop={shop} 
            followersCount={followersCount} 
            productsCount={shopProducts.length} 
          />
          <ShopActions 
            shopId={shop.id}
            isFollowing={isFollowing}
            isFollowLoading={isFollowLoading}
            handleFollow={handleFollow}
            handleShare={handleShare}
            shopName={shop.name}
            onAuthDialogOpen={setShowAuthDialog}
          />
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-3 pb-24">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className={`w-full grid grid-cols-3 h-8 ${isDarkMode ? 'bg-gray-800/70' : 'bg-orange-50'}`}>
            <TabsTrigger value="products" className={`text-xs ${isDarkMode ? 'data-[state=active]:bg-orange-950 data-[state=active]:text-orange-400' : 'data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700'}`}>Products</TabsTrigger>
            <TabsTrigger value="about" className={`text-xs ${isDarkMode ? 'data-[state=active]:bg-orange-950 data-[state=active]:text-orange-400' : 'data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700'}`}>About</TabsTrigger>
            <TabsTrigger value="reviews" className={`text-xs ${isDarkMode ? 'data-[state=active]:bg-orange-950 data-[state=active]:text-orange-400' : 'data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700'}`}>Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-3">
            <ProductGrid 
              products={shopProducts}
              title={`${shop.name} Products`}
              subtitle=""
              columns={isMobile ? 2 : 3}
              showPagination={shopProducts.length > 8}
              itemsPerPage={8}
              showFilters={false}
            />
          </TabsContent>
          
          <TabsContent value="about" className="mt-3">
            <Card className={`border-none shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden`}>
              <CardContent className="p-3 text-xs">
                <h3 className={`font-medium mb-2 text-sm ${isDarkMode ? 'text-orange-400' : 'text-orange-800'}`}>Shop Information</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>{shop.description}</p>
                
                <div className={`${isDarkMode ? 'bg-gray-700/60' : 'bg-orange-50'} p-2 rounded-md`}>
                  <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-700'} text-[11px]`}>Address</h4>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{shop.address}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className={`${isDarkMode ? 'bg-gray-700/60' : 'bg-orange-50'} p-2 rounded-md`}>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-700'} text-[11px]`}>Rating</h4>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span>{shop.rating.toFixed(1)} ({shop.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-700/60' : 'bg-orange-50'} p-2 rounded-md`}>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-700'} text-[11px]`}>Products</h4>
                    <div className="flex items-center">
                      <ShoppingBag className={`h-3 w-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} mr-1`} />
                      <span>{shopProducts.length} products</span>
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-700/60' : 'bg-orange-50'} p-2 rounded-md`}>
                    <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-700'} text-[11px]`}>Followers</h4>
                    <div className="flex items-center">
                      <Users className={`h-3 w-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} mr-1`} />
                      <span>{followersCount} followers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-3">
            <ShopReviewsTab shopId={shop.id} />
          </TabsContent>
        </Tabs>
      </div>

      {showAuthDialog && (
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onLogin={handleLogin}
          title="Authentication Required"
          message="You need to be logged in to follow shops."
        />
      )}
    </div>
  );
};

export default ShopDetail;
