
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

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
  const { isDarkMode } = useTheme();
  
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className={isMobile ? "w-full overflow-x-auto hide-scrollbar" : ""}
      >
        <TabsList className={cn(
          isMobile ? "w-full grid grid-cols-3" : "",
          isDarkMode ? "bg-gray-800 border border-gray-700" : ""
        )}>
          <TabsTrigger 
            value="all"
            className={isDarkMode ? "data-[state=active]:bg-gray-700 data-[state=active]:text-orange-400" : ""}
          >
            All Shops
          </TabsTrigger>
          <TabsTrigger 
            value="verified"
            className={isDarkMode ? "data-[state=active]:bg-gray-700 data-[state=active]:text-orange-400" : ""}
          >
            Verified
          </TabsTrigger>
          <TabsTrigger 
            value="unverified"
            className={isDarkMode ? "data-[state=active]:bg-gray-700 data-[state=active]:text-orange-400" : ""}
          >
            Unverified
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className={`relative ${isMobile ? "w-full" : "w-[280px]"}`}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search shops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "pl-9",
            isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : ""
          )}
        />
      </div>
    </div>
  );
};

export default ShopFilters;
