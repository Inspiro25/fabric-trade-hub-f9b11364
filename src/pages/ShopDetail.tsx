
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShopById, getShopProducts } from '@/lib/shops';
import { Product } from '@/lib/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGrid from '@/components/features/ProductGrid';
import { MapPin, Star, CheckCircle, Store, ArrowLeft, Share2, Calendar, ShoppingBag, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shop } from '@/lib/shops';

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Get shop data and resolve the Promise
        const shopData = await getShopById(id);
        if (shopData) {
          setShop(shopData);
          
          // Fetch products for this shop and resolve the Promise
          const productsData = await getShopProducts(id);
          const resolvedProducts = Array.isArray(productsData) ? productsData : await productsData;
          setShopProducts(resolvedProducts);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShopData();
  }, [id]);
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (shop) {
      toast({
        title: isFollowing ? "Unfollowed shop" : "Following shop",
        description: isFollowing 
          ? `You are no longer following ${shop.name}`
          : `You are now following ${shop.name}`,
        duration: 3000,
      });
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
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Shop link copied to clipboard",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing failed",
        description: "Unable to share shop details",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h2 className="text-lg font-bold mb-3">Shop not found</h2>
        <p className="mb-4 text-sm">The shop you're looking for doesn't exist.</p>
        <Button asChild size="sm">
          <Link to="/shops">Back to Shops</Link>
        </Button>
      </div>
    );
  }

  const createdDate = new Date(shop.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <div className="pb-10">
      {/* Compact Shop Header */}
      <div className="bg-gradient-to-r from-[#E5DEFF] to-[#D6BCFA] shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Link to="/shops">
                <Button size="icon" variant="ghost" className="h-7 w-7 mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-sm font-medium">Shop Details</h1>
            </div>
            
            {/* Add admin link */}
            <Link to="/admin/login">
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Shop Info Card */}
      <div className="container mx-auto px-4 -mt-2">
        <Card className="overflow-hidden border-none shadow-md">
          <div className="h-28 bg-purple-50 relative">
            <img 
              src={shop.coverImage} 
              alt={shop.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-0 right-0 p-2 flex gap-1.5">
              <Button 
                size="sm" 
                variant="secondary" 
                className="h-7 text-xs px-2.5 bg-white/80 backdrop-blur-sm"
                onClick={handleShare}
              >
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
              <Button 
                size="sm" 
                className={`h-7 text-xs px-2.5 ${isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                onClick={handleFollow}
              >
                <Store className="h-3 w-3 mr-1" />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          </div>
          
          <CardContent className="p-3">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white bg-white shadow-sm flex-shrink-0">
                <img 
                  src={shop.logo} 
                  alt={`${shop.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="ml-3">
                <div className="flex items-center">
                  <h2 className="text-sm font-semibold">{shop.name}</h2>
                  {shop.isVerified && (
                    <CheckCircle className="h-3 w-3 text-green-500 ml-1.5" />
                  )}
                </div>
                
                <div className="flex items-center mt-0.5 text-xs text-gray-500">
                  <Star className="h-2.5 w-2.5 text-yellow-500 mr-1" />
                  <span>{shop.rating.toFixed(1)}</span>
                  <span className="mx-1">•</span>
                  <span>{shop.reviewCount} reviews</span>
                </div>
                
                <div className="flex items-center mt-0.5 text-xs text-gray-500">
                  <MapPin className="h-2.5 w-2.5 mr-1" />
                  <span className="truncate">{shop.address}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-600 border-t border-gray-100 pt-2">
              <p className="line-clamp-2">{shop.description}</p>
              
              <div className="flex items-center justify-between mt-2 pt-1">
                <span className="text-[10px] flex items-center text-gray-500">
                  <Calendar className="h-2.5 w-2.5 mr-1" />
                  Joined {timeAgo}
                </span>
                <span className="text-[10px] flex items-center text-purple-600 font-medium">
                  <ShoppingBag className="h-2.5 w-2.5 mr-1" />
                  {shopProducts.length} products
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Shop Content Tabs */}
      <div className="container mx-auto px-4 mt-3">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-8 bg-purple-50">
            <TabsTrigger value="products" className="text-xs">Products</TabsTrigger>
            <TabsTrigger value="about" className="text-xs">About</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs">Reviews</TabsTrigger>
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
            <Card className="border-none shadow-sm bg-white rounded-lg overflow-hidden">
              <CardContent className="p-3 text-xs">
                <h3 className="font-medium mb-2 text-sm text-purple-800">Shop Information</h3>
                <p className="text-gray-600 mb-3">{shop.description}</p>
                
                <div className="bg-purple-50 p-2 rounded-md">
                  <h4 className="font-medium mb-1 text-purple-700 text-[11px]">Address</h4>
                  <p className="text-gray-600">{shop.address}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-purple-50 p-2 rounded-md">
                    <h4 className="font-medium mb-1 text-purple-700 text-[11px]">Rating</h4>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span>{shop.rating.toFixed(1)} ({shop.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded-md">
                    <h4 className="font-medium mb-1 text-purple-700 text-[11px]">Products</h4>
                    <div className="flex items-center">
                      <ShoppingBag className="h-3 w-3 text-purple-600 mr-1" />
                      <span>{shopProducts.length} products</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-3">
            <Card className="border-none shadow-sm bg-white rounded-lg overflow-hidden">
              <CardContent className="p-3 text-center">
                <h3 className="font-medium mb-1 text-sm text-purple-800">Customer Reviews</h3>
                <p className="text-xs text-gray-500">Reviews feature coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopDetail;
