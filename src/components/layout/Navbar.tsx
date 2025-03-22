import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Store, 
  Menu, 
  X, 
  Percent, 
  ChevronDown,
  User,
  Clock,
  History,
  TrendingUp,
  Sun,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const SearchSuggestions = ({ 
  query, 
  history, 
  loading, 
  onSelectItem, 
  onClearHistoryItem,
  popularSearches,
  visible
}: { 
  query: string; 
  history: { id: string; query: string }[];
  popularSearches: string[];
  loading: boolean; 
  onSelectItem: (query: string) => void; 
  onClearHistoryItem: (id: string) => void;
  visible: boolean;
}) => {
  if (!visible) return null;
  if (!query && history.length === 0 && popularSearches.length === 0) return null;
  
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
      {loading ? (
        <div className="p-3 text-center text-gray-500">
          <div className="inline-block animate-spin mr-2">
            <Clock className="h-5 w-5" />
          </div>
          <span>Loading suggestions...</span>
        </div>
      ) : (
        <>
          {query && (
            <div className="p-2 border-b">
              <div 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => onSelectItem(query)}
              >
                <Search className="h-4 w-4 text-[#9b87f5]" />
                <span className="text-sm">Search for "<span className="font-medium">{query}</span>"</span>
              </div>
            </div>
          )}
          
          {popularSearches.length > 0 && (
            <div className="p-2 border-b">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2 px-2">
                <TrendingUp className="h-3 w-3" />
                <span>Popular Searches</span>
              </div>
              
              <div className="flex flex-wrap gap-2 px-2">
                {popularSearches.map((term, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100 border-[#9b87f5] text-[#9b87f5]"
                    onClick={() => onSelectItem(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {history.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2 px-2">
                <History className="h-3 w-3" />
                <span>Recent Searches</span>
              </div>
              
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <div 
                    className="flex items-center gap-2 text-sm text-gray-700"
                    onClick={() => onSelectItem(item.query)}
                  >
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span>{item.query}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearHistoryItem(item.id);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<{ id: string; query: string }[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchSearchHistory();
    } else {
      setSearchHistory([]);
    }
    fetchPopularSearches();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const fetchSearchHistory = async () => {
    if (!currentUser) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', currentUser.uid)
        .order('searched_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching search history:', error);
        return;
      }
      
      setSearchHistory(data || []);
    } catch (err) {
      console.error('Error fetching search history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchPopularSearches = async () => {
    try {
      const { data, error } = await supabase
        .from('popular_search_terms')
        .select('query, count')
        .order('count', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching popular searches:', error);
        setPopularSearches(['smartphone', 'headphones', 'laptop', 'watch', 'camera']);
        return;
      }
      
      if (data && data.length > 0) {
        setPopularSearches(data.map(item => item.query));
      } else {
        setPopularSearches(['smartphone', 'headphones', 'laptop', 'watch', 'camera']);
      }
    } catch (err) {
      console.error('Error fetching popular searches:', err);
      setPopularSearches(['smartphone', 'headphones', 'laptop', 'watch', 'camera']);
    }
  };

  const clearSearchHistoryItem = async (id: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.uid);
        
      if (error) {
        console.error('Error deleting search history item:', error);
        return;
      }
      
      setSearchHistory(prevHistory => 
        prevHistory.filter(item => item.id !== id)
      );
    } catch (err) {
      console.error('Error deleting search history item:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      
      if (currentUser) {
        saveSearchHistory(searchQuery.trim());
      }
      
      setSearchQuery('');
      setShowSuggestions(false);
    } else {
      navigate('/search');
    }
  };

  const saveSearchHistory = async (query: string) => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('search_history')
        .upsert(
          { 
            user_id: currentUser.uid,
            query: query.toLowerCase(),
            searched_at: new Date().toISOString() 
          },
          { onConflict: 'user_id,query' }
        );
      
      fetchSearchHistory();
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const handleSelectSuggestion = (query: string) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
    
    if (currentUser) {
      saveSearchHistory(query);
    }
  };

  if (isMobile) {
    return null;
  }

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm py-3 shadow-sm border-b' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center text-xl font-bold transition-transform hover:scale-105 text-kutuku-primary">
              <Sun className="h-6 w-6 mr-1.5" />
              <Sparkles className="h-3.5 w-3.5 absolute ml-1 -mt-3" />
              <span className="relative">
                VYOMA
                <span className="absolute -top-1 right-0 h-1.5 w-1.5 bg-kutuku-primary rounded-full"></span>
              </span>
            </Link>

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm">Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <ListItem
                        href="/category/electronics"
                        title="Electronics"
                      >
                        Explore our range of electronics and gadgets.
                      </ListItem>
                      <ListItem
                        href="/category/fashion"
                        title="Fashion"
                      >
                        Latest trends in clothing and accessories.
                      </ListItem>
                      <ListItem
                        href="/category/home"
                        title="Home & Kitchen"
                      >
                        Everything you need for your home.
                      </ListItem>
                      <ListItem
                        href="/category/beauty"
                        title="Beauty"
                      >
                        Premium beauty and personal care products.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/shops" className="flex items-center gap-1 px-4 py-2 text-sm hover:text-kutuku-primary">
                    Shops
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/offers" className="flex items-center gap-1 px-4 py-2 text-sm hover:text-kutuku-primary">
                    Offers
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div ref={searchRef} className="relative flex-grow max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search products, brands, categories..."
                className="pr-10 rounded-full border-kutuku-gray focus:border-kutuku-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full flex items-center justify-center text-kutuku-muted hover:text-kutuku-primary"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            <SearchSuggestions 
              query={searchQuery}
              history={searchHistory}
              popularSearches={popularSearches}
              loading={isLoadingHistory}
              onSelectItem={handleSelectSuggestion}
              onClearHistoryItem={clearSearchHistoryItem}
              visible={showSuggestions}
            />
          </div>

          <div className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center text-sm font-medium">
                  <User className="h-4 w-4 mr-1" />
                  Account
                  <ChevronDown className="h-3 w-3 ml-1 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/offers">
                <Percent className="h-5 w-5" />
                <span className="sr-only">Offers</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative ml-1" asChild>
              <Link to="/shops">
                <Store className="h-5 w-5" />
                <span className="sr-only">Shops</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
