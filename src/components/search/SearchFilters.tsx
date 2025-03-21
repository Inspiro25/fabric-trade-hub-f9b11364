
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

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

interface SearchFiltersProps {
  isMobile: boolean;
  categories: Category[];
  shops: Shop[];
  selectedCategory: string | null;
  selectedShop: string | null;
  priceRange: number[];
  rating: number | null;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
  handleCategoryChange: (category: string | null) => void;
  handleShopChange: (shop: string | null) => void;
  handlePriceRangeChange: (value: number[]) => void;
  handleRatingChange: (rating: number | null) => void;
  clearFilters: () => void;
  expanded?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  isMobile,
  categories,
  shops,
  selectedCategory,
  selectedShop,
  priceRange,
  rating,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  handleCategoryChange,
  handleShopChange,
  handlePriceRangeChange,
  handleRatingChange,
  clearFilters,
  expanded = false
}) => {
  // Handle availability filter change
  const [availabilityFilters, setAvailabilityFilters] = React.useState({
    inStock: false,
    fastDelivery: false,
    dealOfDay: false,
    amazonFulfilled: false
  });

  const handleAvailabilityChange = (key: keyof typeof availabilityFilters) => {
    setAvailabilityFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedShop) count++;
    if (rating !== null) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    if (availabilityFilters.inStock) count++;
    if (availabilityFilters.fastDelivery) count++;
    if (availabilityFilters.dealOfDay) count++;
    if (availabilityFilters.amazonFulfilled) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Active filters */}
      {activeFilterCount > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Active Filters</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-auto py-1 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {categories.find(c => c.id === selectedCategory)?.name}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCategoryChange(null)} 
                  className="h-auto w-auto p-0 ml-1"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )}
            {selectedShop && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {shops.find(s => s.id === selectedShop)?.name}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleShopChange(null)} 
                  className="h-auto w-auto p-0 ml-1"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )}
            {rating !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {rating}+ Stars
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRatingChange(null)} 
                  className="h-auto w-auto p-0 ml-1"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                ${priceRange[0]} - ${priceRange[1]}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handlePriceRangeChange([0, 1000])} 
                  className="h-auto w-auto p-0 ml-1"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}

      <Accordion type="multiple" defaultValue={expanded ? ["category", "shop", "price", "rating", "availability"] : []}>
        {/* Categories filter */}
        <AccordionItem value="category">
          <AccordionTrigger className="py-3">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <RadioGroup value={selectedCategory || "all"} onValueChange={(value) => handleCategoryChange(value === 'all' ? null : value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-categories" />
                  <Label htmlFor="all-categories">All Categories</Label>
                </div>
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={category.id} id={`category-${category.id}`} />
                    <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Shops filter */}
        <AccordionItem value="shop">
          <AccordionTrigger className="py-3">Shops</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <RadioGroup value={selectedShop || "all"} onValueChange={(value) => handleShopChange(value === 'all' ? null : value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-shops" />
                  <Label htmlFor="all-shops">All Shops</Label>
                </div>
                {shops.map(shop => (
                  <div key={shop.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={shop.id} id={`shop-${shop.id}`} />
                    <Label htmlFor={`shop-${shop.id}`}>{shop.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Price Range filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="py-3">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
              <Slider
                value={priceRange}
                max={1000}
                step={10}
                onValueChange={handlePriceRangeChange}
                className="my-6"
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="min-price">Min ($)</Label>
                  <input
                    id="min-price"
                    type="number"
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full p-2 border rounded-md text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="max-price">Max ($)</Label>
                  <input
                    id="max-price"
                    type="number"
                    min={priceRange[0]}
                    max={1000}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full p-2 border rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Rating filter */}
        <AccordionItem value="rating">
          <AccordionTrigger className="py-3">Customer Reviews</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroup value={rating?.toString() || "all"} onValueChange={(value) => handleRatingChange(value === 'all' ? null : parseInt(value))}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="rating-all" />
                    <Label htmlFor="rating-all">Any Rating</Label>
                  </div>
                  {[4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center space-x-2">
                      <RadioGroupItem value={star.toString()} id={`rating-${star}`} />
                      <Label htmlFor={`rating-${star}`} className="flex items-center">
                        {star}+ Stars
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Availability filter */}
        <AccordionItem value="availability">
          <AccordionTrigger className="py-3">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-stock" 
                  checked={availabilityFilters.inStock}
                  onCheckedChange={() => handleAvailabilityChange('inStock')}
                />
                <Label htmlFor="in-stock">In Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fast-delivery" 
                  checked={availabilityFilters.fastDelivery}
                  onCheckedChange={() => handleAvailabilityChange('fastDelivery')}
                />
                <Label htmlFor="fast-delivery">Fast Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="deal-of-day" 
                  checked={availabilityFilters.dealOfDay}
                  onCheckedChange={() => handleAvailabilityChange('dealOfDay')}
                />
                <Label htmlFor="deal-of-day">Deal of the Day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fulfilled" 
                  checked={availabilityFilters.amazonFulfilled}
                  onCheckedChange={() => handleAvailabilityChange('amazonFulfilled')}
                />
                <Label htmlFor="fulfilled">Store Fulfilled</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Button className="w-full" variant="outline" onClick={clearFilters}>Clear All Filters</Button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-auto">
          <SheetHeader className="sticky top-0 bg-white z-10 pb-4">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Filter products by category, price, and more.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {renderFilterContent()}
          </div>
          <SheetFooter className="sticky bottom-0 bg-white pt-4 border-t">
            <SheetClose asChild>
              <Button>Apply Filters</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  if (expanded) {
    return renderFilterContent();
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => setMobileFiltersOpen(true)}
      className="relative"
    >
      <Filter className="mr-2 h-4 w-4" />
      Filters
      {activeFilterCount > 0 && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
        >
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  );
};

export default SearchFilters;
