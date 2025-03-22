
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortAsc } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SortOption } from '@/lib/types/search';

interface FilterOption {
  label: string;
  value: string;
}

interface SearchSortProps {
  isMobile: boolean;
  sortOption: string;
  mobileSortOpen: boolean;
  setMobileSortOpen: (open: boolean) => void;
  handleSortChange: (value: string) => void;
}

const SearchSort: React.FC<SearchSortProps> = ({
  isMobile,
  sortOption,
  mobileSortOpen,
  setMobileSortOpen,
  handleSortChange
}) => {
  const sortOptions: FilterOption[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Rating', value: 'rating' },
    { label: 'Popularity', value: 'popularity' },
    { label: 'Relevance', value: 'relevance' }
  ];

  const renderSortContent = () => (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="sort">Sort By</Label>
        <Select value={sortOption} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Relevance" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (isMobile) {
    return (
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
          {renderSortContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
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
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchSort;
