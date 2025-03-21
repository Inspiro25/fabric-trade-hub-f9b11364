
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShopById, getShopProducts } from '@/lib/shops';
import { allProducts } from '@/lib/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGrid from '@/components/features/ProductGrid';
import { MapPin, Star, CheckCircle, Store, ArrowLeft, Share2, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  
  const shop = useMemo(() => {
    if (!id) return null;
    return getShopById(id);
  }, [id]);
  
  const shopProducts = useMemo(() => {
    if (!id) return [];
    return getShopProducts(id, allProducts);
  }, [id]);

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Shop not found</h2>
        <p className="mb-6">The shop you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/shops">Back to Shops</Link>
        </Button>
      </div>
    );
  }

  const createdDate = new Date(shop.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <div className="pb-20">
      {/* Shop Header */}
      <div className="relative">
        <div className="h-48 bg-gray-200">
          <img 
            src={shop.coverImage} 
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="relative -mt-16 bg-white p-4 rounded-lg shadow-sm border sm:flex sm:items-end sm:p-6">
            <div className="absolute top-4 left-4 sm:relative sm:top-auto sm:left-auto">
              <Link to="/shops">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="ml-12 sm:ml-0 sm:flex sm:items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white bg-white mr-4">
                <img 
                  src={shop.logo} 
                  alt={`${shop.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mt-4 sm:mt-0">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold">{shop.name}</h1>
                  {shop.isVerified && (
                    <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                  )}
                </div>
                
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  <span>{shop.rating.toFixed(1)}</span>
                  <span className="mx-1">•</span>
                  <span>{shop.reviewCount} reviews</span>
                  <span className="mx-1">•</span>
                  <Calendar className="h-3 w-3 mx-1" />
                  <span>Joined {timeAgo}</span>
                </div>
                
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{shop.address}</span>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:flex sm:ml-auto">
              <Button size="sm" variant="outline" className="mr-2">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button size="sm">
                <Store className="h-4 w-4 mr-1" />
                Follow Shop
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Action Buttons */}
      {isMobile && (
        <div className="container mx-auto px-4 mt-4 flex">
          <Button className="flex-1 mr-2" size="sm" variant="outline">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button className="flex-1" size="sm">
            <Store className="h-4 w-4 mr-1" />
            Follow Shop
          </Button>
        </div>
      )}
      
      {/* Shop Description */}
      <div className="container mx-auto px-4 mt-6">
        <h2 className="text-lg font-semibold mb-2">About this shop</h2>
        <p className="text-muted-foreground">{shop.description}</p>
      </div>
      
      {/* Shop Content Tabs */}
      <div className="container mx-auto px-4 mt-6">
        <Tabs defaultValue="products">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="products">Products ({shopProducts.length})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({shop.reviewCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-6">
            <ProductGrid 
              products={shopProducts}
              title={`${shop.name} Products`}
              subtitle={`Browse all products offered by ${shop.name}`}
              columns={3}
              showPagination={shopProducts.length > 12}
              itemsPerPage={12}
              showFilters={true}
            />
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Shop Information</h3>
              <p className="text-muted-foreground mb-4">{shop.description}</p>
              
              <h4 className="font-medium mb-1">Address</h4>
              <p className="text-muted-foreground mb-4">{shop.address}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Rating</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{shop.rating.toFixed(1)} ({shop.reviewCount} reviews)</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Products</h4>
                  <p>{shopProducts.length} products</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-semibold mb-2">Customer Reviews</h3>
              <p className="text-muted-foreground">Reviews feature coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopDetail;
