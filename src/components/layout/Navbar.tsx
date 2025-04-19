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
import AccountDropdown from '@/components/features/AccountDropdown';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

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
  const { user } = useAuth();
  const { getCartCount } = useCart();
  const cartItemCount = getCartCount();

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    } else {
      setSearchHistory([]);
    }
    fetchPopularSearches();
  }, [user]);

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
    if (!user) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.uid)
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
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.uid);
        
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
    console.log('[Navbar] handleSearch called with query:', searchQuery);
    
    if (searchQuery && searchQuery.trim()) {
      // Use URLSearchParams for more robust query string handling
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      const searchUrl = `/search?${params.toString()}`;
      
      console.log('[Navbar] Navigating to:', searchUrl);
      navigate(searchUrl);
      
      if (user) {
        saveSearchHistory(searchQuery.trim());
      }
      
      // Only clear suggestions, not the search query
      setShowSuggestions(false);
    }
  };

  const saveSearchHistory = async (query: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('search_history')
        .upsert(
          { 
            user_id: user.uid,
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

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(new Event('submit') as any);
  };

  if (isMobile) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Logo */}
            <Link to="/" className="flex items-center text-xl font-bold text-vyoma-primary">
              <Sun className="h-6 w-6 mr-1.5" />
              <span>VYOMA</span>
            </Link>

            {/* Mobile Right Side Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/offers">
                  <Percent className="h-5 w-5" />
                  <span className="sr-only">Offers</span>
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white rounded-full text-xs w-5 h-5">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="py-2">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products, brands, categories..."
                className="pr-10 rounded-full border-vyoma-gray focus:border-vyoma-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full flex items-center justify-center text-vyoma-muted hover:text-vyoma-primary"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-white">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link to="/" className="flex items-center text-xl font-bold text-vyoma-primary">
                    <Sun className="h-6 w-6 mr-1.5" />
                    <span>VYOMA</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <nav className="px-4 py-2">
                    <div className="space-y-1">
                      <Link
                        to="/category/electronics"
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Electronics
                      </Link>
                      <Link
                        to="/category/fashion"
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Fashion
                      </Link>
                      <Link
                        to="/category/home"
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Home & Kitchen
                      </Link>
                      <Link
                        to="/category/beauty"
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Beauty
                      </Link>
                    </div>
                  </nav>
                </div>

                <div className="border-t p-4">
                  <AccountDropdown />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    );
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

  const letterVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { scale: 1.2, y: -5, transition: { duration: 0.2 } }
  };

  const createLetterDelays = (word: string) => {
    return Array.from(word).map((_, i) => ({
      transition: { delay: i * 0.05 }
    }));
  };

  const letterDelays = createLetterDelays("VYOMA");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm py-3 shadow-sm border-b' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center text-xl font-bold transition-transform hover:scale-105 text-vyoma-primary">
              <motion.div 
                className="flex items-center relative"
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0.8, 1], 
                    scale: [0, 1, 0.9, 1] 
                  }}
                  transition={{ 
                    duration: 1.5,
                    times: [0, 0.4, 0.7, 1]
                  }}
                >
                  <Sun className="h-6 w-6 mr-1.5" />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: [0, 20, -20, 0] 
                  }}
                  transition={{ 
                    delay: 0.7, 
                    duration: 1.2,
                    rotate: { times: [0, 0.3, 0.6, 1] }
                  }}
                  className="absolute ml-1 -mt-3"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </motion.div>
                
                <div className="flex">
                  {Array.from("VYOMA").map((letter, index) => (
                    <motion.span
                      key={index}
                      variants={letterVariants}
                      custom={index}
                      transition={{ 
                        delay: 0.3 + index * 0.1,
                        duration: 0.4, 
                        type: "spring", 
                        stiffness: 300
                      }}
                      className="relative"
                      whileHover={{
                        color: "#FE7235",
                        y: -4,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {letter}
                      {index === 4 && (
                        <motion.span 
                          className="absolute -top-1 right-0 h-1.5 w-1.5 bg-vyoma-primary rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.5, 1] }}
                          transition={{ delay: 1.2, duration: 0.5 }}
                        />
                      )}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
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
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div ref={searchRef} className="relative flex-grow max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search products, brands, categories..."
                className="pr-10 rounded-full border-vyoma-gray focus:border-vyoma-primary"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // Delay hiding suggestions to allow for click events
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full flex items-center justify-center text-vyoma-muted hover:text-vyoma-primary"
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

          <div className="flex items-center space-x-4">
            <AccountDropdown />

            <Button variant="ghost" size="icon" className="relative hover:text-vyoma-primary" asChild>
              <Link to="/offers">
                <Percent className="h-5 w-5" />
                <span className="sr-only">Offers</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative hover:text-vyoma-primary" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white rounded-full text-xs w-5 h-5">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative hover:text-vyoma-primary" asChild>
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
