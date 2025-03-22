
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

interface ShopFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile?: boolean;
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  isMobile = false
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className={isMobile ? "w-full overflow-x-auto hide-scrollbar" : ""}
      >
        <TabsList className={isMobile ? "w-full grid grid-cols-3" : ""}>
          <TabsTrigger value="all">All Shops</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="unverified">Unverified</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className={`relative ${isMobile ? "w-full" : "w-[280px]"}`}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search shops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};

export default ShopFilters;
