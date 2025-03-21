
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

interface ShopFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Shops</TabsTrigger>
          <TabsTrigger value="verified">Verified Shops</TabsTrigger>
          <TabsTrigger value="unverified">Unverified Shops</TabsTrigger>
        </TabsList>
        
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search shops..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1" 
          />
        </div>
      </Tabs>
    </>
  );
};

export default ShopFilters;
