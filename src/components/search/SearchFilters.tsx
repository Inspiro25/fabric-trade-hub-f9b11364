
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
  clearFilters
}) => {
  const renderFilterContent = () => (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={selectedCategory || 'all'} onValueChange={(value) => handleCategoryChange(value === 'all' ? null : value)}>
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
        <Select value={selectedShop || 'all'} onValueChange={(value) => handleShopChange(value === 'all' ? null : value)}>
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
        <Select 
          value={rating ? rating.toString() : 'all'} 
          onValueChange={(value) => handleRatingChange(value === 'all' ? null : parseInt(value))}
        >
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
  );

  if (isMobile) {
    return (
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
          {renderFilterContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden sm:block">
      {renderFilterContent()}
    </div>
  );
};

export default SearchFilters;
