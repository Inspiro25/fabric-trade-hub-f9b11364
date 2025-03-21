
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CalendarIcon, CheckCircleIcon, Copy, Filter, Heart, Loader2, MoreVertical, Plus, Search as SearchIcon, Share2, ShoppingCart, SortAsc, SortDesc, X } from 'lucide-react';
import { addDays, format } from "date-fns"
import { Product as ImportedProduct } from '@/lib/types/product';

// Rename the local interface to avoid conflicts with the imported Product type
interface SearchPageProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  rating: number;
  review_count: number;
  is_new: boolean;
  is_trending: boolean;
  sale_price: number | null;
  colors: string[] | null;
  sizes: string[] | null;
  category_id: string | null;
  shop_id: string | null;
}

// Helper function to convert SearchPageProduct to ImportedProduct
const convertToImportedProduct = (product: SearchPageProduct): ImportedProduct => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    salePrice: product.sale_price || undefined,
    images: product.images,
    category: product.category_id || "uncategorized",
    colors: product.colors || [],
    sizes: product.sizes || [],
    isNew: product.is_new,
    isTrending: product.is_trending,
    rating: product.rating,
    reviewCount: product.review_count,
    stock: 10, // Default value for stock
    tags: [], // Default empty tags
    shopId: product.shop_id
  };
};

interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
}

interface Shop {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  cover_image: string | null;
  rating: number | null;
  review_count: number | null;
  is_verified: boolean | null;
  address: string | null;
  owner_name: string | null;
  owner_email: string | null;
  shop_id: string | null;
  status: string | null;
}

interface FilterOption {
  label: string;
  value: string;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<SearchPageProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [rating, setRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SearchPageProduct | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleAddToCart = async (product: SearchPageProduct) => {
    if (!currentUser) {
      setSelectedProduct(product);
      setIsDialogOpen(true);
      return;
    }

    setIsAddingToCart(product.id);
    try {
      // Convert to imported Product type before passing to addToCart
      const convertedProduct = convertToImportedProduct(product);
      await addToCart(convertedProduct, 1, convertedProduct.colors[0] || null, convertedProduct.sizes[0] || null);
      toast({
        title: "Success",
        description: `${product.name} added to cart.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart.",
      });
    } finally {
      setIsAddingToCart(null);
    }
  };

  const handleAddToWishlist = async (product: SearchPageProduct) => {
    if (!currentUser) {
      setSelectedProduct(product);
      setIsDialogOpen(true);
      return;
    }

    setIsAddingToWishlist(product.id);
    try {
      // Convert to imported Product type before passing to addToWishlist
      const convertedProduct = convertToImportedProduct(product);
      await addToWishlist(convertedProduct);
      toast({
        title: "Success",
        description: `${product.name} added to wishlist.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to wishlist.",
      });
    } finally {
      setIsAddingToWishlist(null);
    }
  };

  const handleShareProduct = (product: SearchPageProduct) => {
    const productLink = `${window.location.origin}/product/${product.id}`;
    setShareableLink(productLink);
    setIsShareDialogOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const productsResponse = await fetch(`/api/products?q=${query}`);
        if (!productsResponse.ok) {
          throw new Error(`Failed to fetch products: ${productsResponse.status}`);
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);

        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const shopsResponse = await fetch('/api/shops');
        if (!shopsResponse.ok) {
          throw new Error(`Failed to fetch shops: ${shopsResponse.status}`);
        }
        const shopsData = await shopsResponse.json();
        setShops(shopsData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const filteredProducts = products.filter(product => {
    if (selectedCategory && product.category_id !== selectedCategory) {
      return false;
    }
    if (selectedShop && product.shop_id !== selectedShop) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (rating && product.rating !== rating) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return 0;
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleShopChange = (shop: string | null) => {
    setSelectedShop(shop);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleRatingChange = (rating: number | null) => {
    setRating(rating);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedShop(null);
    setPriceRange([0, 1000]);
    setRating(null);
  };

  const filterOptions: FilterOption[] = [
    { label: 'Category', value: 'category' },
    { label: 'Shop', value: 'shop' },
    { label: 'Price', value: 'price' },
    { label: 'Rating', value: 'rating' },
  ];

  const sortOptions: FilterOption[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Rating', value: 'rating' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
        <div className="flex items-center space-x-2">
          {isMobile ? (
            <>
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="sm:hidden">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Apply filters to refine your search results.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="shop">Shop</Label>
                      <Select value={selectedShop || 'all'} onValueChange={handleShopChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Shops" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Shops</SelectItem>
                          {shops.map(shop => (
                            <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Price Range (${priceRange[0]} - ${priceRange[1]})</Label>
                      <Slider
                        defaultValue={priceRange}
                        max={1000}
                        step={10}
                        onValueChange={handlePriceRangeChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Select value={rating ? rating.toString() : 'all'} onValueChange={(value) => handleRatingChange(value === 'all' ? null : parseInt(value))}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Ratings" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars & Up</SelectItem>
                          <SelectItem value="3">3 Stars & Up</SelectItem>
                          <SelectItem value="2">2 Stars & Up</SelectItem>
                          <SelectItem value="1">1 Star & Up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
                  </div>
                </SheetContent>
              </Sheet>
              <Sheet open={mobileSortOpen} onOpenChange={setMobileSortOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SortAsc className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="sm:hidden">
                  <SheetHeader>
                    <SheetTitle>Sort</SheetTitle>
                    <SheetDescription>
                      Sort the search results based on your preference.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="sort">Sort By</Label>
                      <Select value={sortOption} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Relevance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="price-asc">Price: Low to High</SelectItem>
                          <SelectItem value="price-desc">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Label htmlFor="shop">Shop</Label>
                    <Select value={selectedShop || 'all'} onValueChange={handleShopChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Shops" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Shops</SelectItem>
                        {shops.map(shop => (
                          <SelectItem key={shop.id} value={shop.id}>{shop.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Label>Price Range (${priceRange[0]} - ${priceRange[1]})</Label>
                    <Slider
                      defaultValue={priceRange}
                      max={1000}
                      step={10}
                      onValueChange={handlePriceRangeChange}
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Label htmlFor="rating">Rating</Label>
                    <Select value={rating ? rating.toString() : 'all'} onValueChange={(value) => handleRatingChange(value === 'all' ? null : parseInt(value))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Ratings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars & Up</SelectItem>
                        <SelectItem value="3">3 Stars & Up</SelectItem>
                        <SelectItem value="2">2 Stars & Up</SelectItem>
                        <SelectItem value="1">1 Star & Up</SelectItem>
                      </SelectContent>
                    </Select>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SortAsc className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Select value={sortOption} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Relevance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                      </SelectContent>
                    </Select>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading products...
        </div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-gray-500">No products found matching your search criteria.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map(product => (
            <Card key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.is_new && (
                  <Badge className="absolute top-2 left-2 bg-blue-500 text-white">New</Badge>
                )}
                {product.is_trending && (
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white">Trending</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description.substring(0, 50)}...</p>
                <div className="flex items-center justify-between">
                  <div>
                    {product.sale_price !== null ? (
                      <>
                        <span className="text-red-500 line-through">${product.price}</span>
                        <span className="text-xl font-bold ml-2">${product.sale_price}</span>
                      </>
                    ) : (
                      <span className="text-xl font-bold">${product.price}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-yellow-500 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 1l2.939 4.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span>{product.rating} ({product.review_count})</span>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={isAddingToCart === product.id}
                  >
                    {isAddingToCart === product.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAddToWishlist(product)}
                    disabled={isAddingToWishlist === product.id}
                  >
                    {isAddingToWishlist === product.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </>
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShareProduct(product)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to add items to the cart.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => {
              setIsDialogOpen(false);
              navigate('/auth');
            }}>
              Go to Authentication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Product</DialogTitle>
            <DialogDescription>
              Share this product with your friends.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input type="text" value={shareableLink} readOnly className="flex-1" />
            <Button variant="secondary" size="sm" onClick={copyToClipboard} disabled={isCopied}>
              {isCopied ? (
                <>
                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;
