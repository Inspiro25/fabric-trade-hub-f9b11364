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
import { cn } from '@/lib/utils';

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
  
  // Update pagination state with mobile considerations
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 6 : 8; // Reduce items per page on mobile
  const [isPageChanging, setIsPageChanging] = useState(false);

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

  // Improved page change handler with smooth scroll
  const handlePageChange = useCallback((page: number) => {
    setIsPageChanging(true);
    setCurrentPage(page);
    
    // Get the products section element
    const productsSection = document.querySelector('[data-value="products"]');
    
    if (productsSection) {
      // Smooth scroll to just above the products section
      const yOffset = -60; // Offset to account for sticky header
      const y = productsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
    
    // Reset the page changing state after animation
    setTimeout(() => {
      setIsPageChanging(false);
    }, 500);
  }, []);

  // Calculate paginated products with loading state
  const paginatedProducts = shopProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-blue-500' : 'border-blue-500'}`}></div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className={`container mx-auto px-4 py-6 text-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50'}`}>
        <h2 className="text-xl font-semibold mb-2">Shop Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">The shop you're looking for doesn't exist or has been removed.</p>
        <Link to="/shops" className={`px-4 py-2 rounded text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}>
          Back to Shops
        </Link>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen pb-16",
      isDarkMode ? "bg-gray-900" : "bg-blue-50"
    )}>
      <ShopDetailHeader isDarkMode={isDarkMode} />
      
      <div className={cn(
        "container mx-auto px-4",
        isMobile ? "-mt-1" : "-mt-2"
      )}>
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
      
      <div className={cn(
        "container mx-auto px-4",
        isMobile ? "mt-2" : "mt-3",
        "pb-24"
      )}>
        <Tabs defaultValue="products" className="w-full">
          <TabsList className={cn(
            "w-full grid grid-cols-3",
            isMobile ? "h-10" : "h-8",
            isDarkMode ? "bg-gray-800/70" : "bg-blue-50"
          )}>
            <TabsTrigger 
              value="products" 
              className={cn(
                isMobile ? "text-[11px]" : "text-xs",
                isDarkMode 
                  ? "data-[state=active]:bg-blue-950 data-[state=active]:text-blue-400" 
                  : "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              )}
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="about" 
              className={cn(
                isMobile ? "text-[11px]" : "text-xs",
                isDarkMode 
                  ? "data-[state=active]:bg-blue-950 data-[state=active]:text-blue-400" 
                  : "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              )}
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className={cn(
                isMobile ? "text-[11px]" : "text-xs",
                isDarkMode 
                  ? "data-[state=active]:bg-blue-950 data-[state=active]:text-blue-400" 
                  : "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              )}
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          
          <TabsContent 
            value="products" 
            className={cn(
              isMobile ? "mt-2" : "mt-3",
              isPageChanging ? "opacity-60 transition-opacity duration-200" : ""
            )}
          >
            <ProductGrid 
              products={paginatedProducts}
              title={`${shop.name} Products`}
              subtitle=""
              columns={isMobile ? 2 : 3}
              showPagination={shopProducts.length > itemsPerPage}
              itemsPerPage={itemsPerPage}
              totalItems={shopProducts.length}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              showFilters={false}
              paginationClassName={cn(
                "mt-4",
                isMobile ? "text-sm space-x-1" : "text-base space-x-2"
              )}
              isLoading={isPageChanging}
            />
          </TabsContent>
          
          <TabsContent value="about" className={cn(
            isMobile ? "mt-2" : "mt-3"
          )}>
            <Card className={cn(
              "border-none shadow-sm rounded-lg overflow-hidden",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}>
              <CardContent className={cn(
                isMobile ? "p-2.5" : "p-3",
                "text-xs"
              )}>
                <h3 className={cn(
                  "font-medium mb-2",
                  isMobile ? "text-xs" : "text-sm",
                  isDarkMode ? "text-blue-400" : "text-blue-800"
                )}>
                  Shop Information
                </h3>
                <p className={cn(
                  "mb-3",
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                )}>
                  {shop.description}
                </p>
                
                <div className={cn(
                  "p-2 rounded-md",
                  isDarkMode ? "bg-gray-700/60" : "bg-blue-50"
                )}>
                  <h4 className={cn(
                    "font-medium mb-1",
                    isDarkMode ? "text-blue-400" : "text-blue-700",
                    isMobile ? "text-[10px]" : "text-[11px]"
                  )}>
                    Address
                  </h4>
                  <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                    {shop.address}
                  </p>
                </div>
                
                <div className={cn(
                  "grid grid-cols-3 gap-2",
                  isMobile ? "mt-2" : "mt-3"
                )}>
                  <div className={cn(
                    "p-2 rounded-md",
                    isDarkMode ? "bg-gray-700/60" : "bg-blue-50"
                  )}>
                    <h4 className={cn(
                      "font-medium mb-1",
                      isDarkMode ? "text-blue-400" : "text-blue-700",
                      isMobile ? "text-[10px]" : "text-[11px]"
                    )}>
                      Rating
                    </h4>
                    <div className="flex items-center">
                      <Star className={cn(
                        "text-yellow-500 mr-1",
                        isMobile ? "h-2.5 w-2.5" : "h-3 w-3"
                      )} />
                      <span>{shop.rating.toFixed(1)} ({shop.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className={cn(
                    "p-2 rounded-md",
                    isDarkMode ? "bg-gray-700/60" : "bg-blue-50"
                  )}>
                    <h4 className={cn(
                      "font-medium mb-1",
                      isDarkMode ? "text-blue-400" : "text-blue-700",
                      isMobile ? "text-[10px]" : "text-[11px]"
                    )}>
                      Products
                    </h4>
                    <div className="flex items-center">
                      <ShoppingBag className={cn(
                        "mr-1",
                        isMobile ? "h-2.5 w-2.5" : "h-3 w-3",
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      )} />
                      <span>{shopProducts.length} products</span>
                    </div>
                  </div>
                  <div className={cn(
                    "p-2 rounded-md",
                    isDarkMode ? "bg-gray-700/60" : "bg-blue-50"
                  )}>
                    <h4 className={cn(
                      "font-medium mb-1",
                      isDarkMode ? "text-blue-400" : "text-blue-700",
                      isMobile ? "text-[10px]" : "text-[11px]"
                    )}>
                      Followers
                    </h4>
                    <div className="flex items-center">
                      <Users className={cn(
                        "mr-1",
                        isMobile ? "h-2.5 w-2.5" : "h-3 w-3",
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      )} />
                      <span>{followersCount} followers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className={cn(
            isMobile ? "mt-2" : "mt-3"
          )}>
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
