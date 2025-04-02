import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShopById, getShopProducts } from '@/lib/shops';
import { Product } from '@/lib/products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGrid from '@/components/features/ProductGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Shop } from '@/lib/shops';
import ShopReviewsTab from '@/components/reviews/ShopReviewsTab';
import { checkFollowStatus, followShop, unfollowShop, getShopFollowersCount } from '@/lib/supabase/shopFollows';
import { supabase } from '@/integrations/supabase/client';
import AuthDialog from '@/components/search/AuthDialog';
import { useTheme } from '@/contexts/ThemeContext';
import ShopDetailHeader from '@/components/shop/ShopDetailHeader';
import ShopDetailCard from '@/components/shop/ShopDetailCard';
import ShopActions from '@/components/shop/ShopActions';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingBag, Users } from 'lucide-react';

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();
  const [isFollowing, setIsFollowing] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session } } = await supabase.auth.getSession();
        const isLoggedIn = !!session?.user;
        setIsUserLoggedIn(isLoggedIn);
        console.log("User logged in status:", isLoggedIn, "User ID:", session?.user?.id);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsUserLoggedIn(false);
      }
    };
    
    checkAuthStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const isLoggedIn = !!session?.user;
      console.log("Auth state changed:", isLoggedIn ? "Logged in" : "Logged out", "User ID:", session?.user?.id);
      setIsUserLoggedIn(isLoggedIn);
      
      if (isLoggedIn && shop && id) {
        checkFollowStatus(shop.id).then(status => {
          console.log("Follow status after login:", status);
          setIsFollowing(status);
        });
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [shop?.id]);

  useEffect(() => {
    const fetchShopData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const shopData = await getShopById(id);
        console.log("Fetched shop data:", shopData ? "Success" : "Failed");
        
        if (shopData) {
          setShop(shopData);
          
          const productsData = await getShopProducts(id);
          setShopProducts(productsData);
          
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            console.log("User is logged in, checking follow status with user ID:", session.user.id);
            const isUserFollowing = await checkFollowStatus(shopData.id);
            console.log("User follow status:", isUserFollowing);
            setIsFollowing(isUserFollowing);
            setIsUserLoggedIn(true);
          } else {
            console.log("User is not logged in, skipping follow check");
            setIsUserLoggedIn(false);
          }
          
          const count = await getShopFollowersCount(shopData.id);
          setFollowersCount(count);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        toast.error("Failed to load shop details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShopData();
  }, [id]);
  
  const handleFollow = async () => {
    if (!id || !shop) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("User not logged in, showing auth dialog");
      setIsAuthDialogOpen(true);
      return;
    }
    
    setIsFollowLoading(true);
    
    try {
      console.log("Processing follow action with user ID:", session.user.id);
      
      let success;
      if (isFollowing) {
        success = await unfollowShop(shop.id);
        if (success) {
          setIsFollowing(false);
          setFollowersCount(prev => Math.max(0, prev - 1));
          toast.success(`You are no longer following ${shop.name}`);
        }
      } else {
        success = await followShop(shop.id);
        if (success) {
          setIsFollowing(true);
          setFollowersCount(prev => prev + 1);
          toast.success(`You are now following ${shop.name}`);
        }
      }
      
      if (!success) {
        throw new Error("Follow/unfollow action failed");
      }
    } catch (error) {
      console.error('Error following/unfollowing shop:', error);
      toast.error("Could not process your request. Please try again.");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsAuthDialogOpen(false);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log("User logged in successfully after auth dialog:", session.user.id);
      setIsUserLoggedIn(true);
      
      if (shop) {
        const isUserFollowing = await checkFollowStatus(shop.id);
        setIsFollowing(isUserFollowing);
      }
      
      toast.success('Logged in successfully');
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

  if (!shop) {
    return (
      <div className={`container mx-auto px-4 py-6 text-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-orange-50'}`}>
        <h2 className="text-lg font-bold mb-3">Shop not found</h2>
        <p className="mb-4 text-sm">The shop you're looking for doesn't exist.</p>
        <Link to="/shops" className={`px-4 py-2 rounded text-white ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'}`}>
          Back to Shops
        </Link>
      </div>
    );
  }

  return (
    <div className={`pb-10 ${isDarkMode ? 'bg-gray-900' : 'bg-orange-50'}`}>
      <ShopDetailHeader isDarkMode={isDarkMode} />
      
      <div className="container mx-auto px-4 -mt-2">
        <div className="relative">
          <ShopDetailCard 
            shop={shop} 
            followersCount={followersCount} 
            productsCount={shopProducts.length} 
          />
          <ShopActions 
            isFollowing={isFollowing}
            isFollowLoading={isFollowLoading}
            isUserLoggedIn={isUserLoggedIn}
            handleFollow={handleFollow}
            handleShare={handleShare}
            shopName={shop.name}
          />
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-3">
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

      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen}
        onLogin={handleLogin}
        title="Authentication Required"
        message="You need to be logged in to follow shops."
      />
    </div>
  );
};

export default ShopDetail;
