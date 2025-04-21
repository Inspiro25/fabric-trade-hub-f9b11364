import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { 
  Search, 
  MapPin,
  ChevronDown,
  Menu,
  X,
  User,
  Store,
  Sun,
  Moon,
  Package,
  Tag,
  HelpCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '../ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '../ui/input';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const categories = [
  "All Categories",
  "Deals",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books",
  "Beauty",
  "Sports",
  "Automotive"
];

const letterVariants = {
  initial: { y: -20, opacity: 0 },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }),
  hover: {
    scale: 1.1,
    transition: { duration: 0.2 }
  }
};

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, userProfile, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?category=${selectedCategory}&query=${searchQuery}`);
  };

  const handleSignIn = () => {
    setIsMobileMenuOpen(false);
    navigate('/auth/login');
  };

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full',
      isDarkMode ? 'bg-blue-950 text-white' : 'bg-blue-600 text-white',
      isScrolled && 'shadow-md'
    )}>
      {/* Top Navigation Row */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col gap-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center">
                <motion.div
                  className="flex items-center"
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  {"ZALEKART".split('').map((letter, i) => (
                    <motion.span
                      key={i}
                      variants={letterVariants}
                      custom={i}
                      className="text-2xl font-bold text-white inline-block"
                      style={{ 
                        textShadow: '0 0 10px rgba(255,255,255,0.3)',
                        color: i === 0 ? '#60a5fa' : 'white'
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Mobile Sign In Button */}
              {!currentUser && (
                <Button
                  onClick={handleSignIn}
                  className="lg:hidden bg-white text-blue-600 hover:bg-blue-50"
                  size="sm"
                >
                  Sign in
                </Button>
              )}

              {/* Delivery Location - Mobile */}
              <button className="lg:hidden flex items-center gap-1 hover:text-blue-200">
                <MapPin className="h-5 w-5" />
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs text-gray-300">Deliver to</span>
                  <span className="text-sm font-semibold">Mattannur</span>
                </div>
              </button>

              {/* Desktop Navigation Items */}
              <div className="hidden lg:flex items-center space-x-6">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex flex-col items-start hover:text-blue-200">
                    <span className="text-xs">Hello, {userProfile?.displayName || 'Sign in'}</span>
                    <span className="font-bold flex items-center">
                      Account & Lists <ChevronDown className="ml-1 h-4 w-4" />
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    {!currentUser ? (
                      <div className="p-4 text-center">
                        <Button 
                          onClick={handleSignIn}
                          className="w-full mb-2 bg-white text-blue-600 hover:bg-blue-50"
                          size="sm"
                        >
                          Sign in
                        </Button>
                        <p className="text-sm text-gray-600">
                          New customer?{' '}
                          <Link 
                            to="/auth/login" 
                            state={{ tab: "signup" }}
                            className="text-blue-600 hover:underline"
                          >
                            Start here
                          </Link>
                        </p>
                      </div>
                    ) : (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/account/settings')}>
                          Your Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/account/orders')}>
                          Your Orders
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                          Your Wishlist
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout}>
                          Sign Out
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link to="/account/orders" className="flex flex-col hover:text-blue-200">
                  <span className="text-xs">My</span>
                  <span className="font-bold">Orders</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Search Bar Row */}
          <div className="flex items-center gap-4">
            {/* Delivery Location - Desktop */}
            <button className="hidden lg:flex items-center space-x-1 text-sm hover:text-blue-200 min-w-[140px]">
              <MapPin className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="text-gray-300 text-xs">Deliver to</span>
                <span className="font-bold">Mattannur 670702</span>
              </div>
            </button>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-1">
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center px-4 bg-white text-blue-900 rounded-l-md border-r border-blue-200">
                  {selectedCategory} <ChevronDown className="ml-2 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className={cn(
                  "flex-1 focus-visible:ring-0 bg-white text-blue-900",
                  "rounded-l-md lg:rounded-none"
                )}
              />
              <Button 
                type="submit" 
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 rounded-r-md"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'lg:hidden absolute w-full shadow-lg',
              isDarkMode ? 'bg-blue-900' : 'bg-blue-700'
            )}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/account/settings" 
                  className="text-sm hover:text-blue-200 flex items-center gap-2"
                  onClick={handleMenuItemClick}
                >
                  <User className="h-4 w-4" />
                  Your Profile
                </Link>
                <Link 
                  to="/account/orders" 
                  className="text-sm hover:text-blue-200 flex items-center gap-2"
                  onClick={handleMenuItemClick}
                >
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
                <Link 
                  to="/offers" 
                  className="text-sm hover:text-blue-200 flex items-center gap-2"
                  onClick={handleMenuItemClick}
                >
                  <Tag className="h-4 w-4" />
                  Offers
                </Link>
                <Link 
                  to="/help" 
                  className="text-sm hover:text-blue-200 flex items-center gap-2"
                  onClick={handleMenuItemClick}
                >
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </Link>
                <Link 
                  to="/partner" 
                  className="text-sm hover:text-blue-200 flex items-center gap-2"
                  onClick={handleMenuItemClick}
                >
                  <Store className="h-4 w-4" />
                  Become a Partner
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Row (Desktop Only) */}
      <div className={cn(
        'hidden lg:block py-2',
        isDarkMode ? 'bg-blue-900' : 'bg-blue-700'
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-6">
            <button className="flex items-center text-sm hover:text-blue-200">
              <Menu className="h-5 w-5 mr-1" />
              All
            </button>
            <Link to="/offers" className="text-sm hover:text-blue-200">Offers</Link>
            <Link to="/help" className="text-sm hover:text-blue-200">Help Center</Link>
            <Link to="/registry" className="text-sm hover:text-blue-200">Registry</Link>
            <Link to="/gift-cards" className="text-sm hover:text-blue-200">Gift Cards</Link>
            <Link to="/partner" className="text-sm hover:text-blue-200 flex items-center gap-1">
              <Store className="h-4 w-4" />
              Become a Partner
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navigation;