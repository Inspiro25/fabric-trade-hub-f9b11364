
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription 
} from '../ui/sheet';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationBadge from '../features/NotificationBadge';
import { motion, AnimatePresence } from 'framer-motion';
// Remove this line
// import MobileNav from './MobileNav';

// Add these imports at the top with other imports
import { 
  Home, ShoppingBag, Tag, TrendingUp, User, LogOut, Heart, 
  Settings, Bell, HelpCircle, History, Store, ShoppingCart,
  Users, MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Add these new imports
import { 
  Compass, 
  Zap, 
  Gift, 
  Coffee,
  Sparkles as SparklesIcon,
  Star, 
  ShoppingBasket
} from 'lucide-react';

// Update navigation links with new sections
// Keep only one instance of each array at the top
const navigationLinks = [
  { name: 'Discover', path: '/', icon: <Compass className="h-5 w-5" /> },
  { name: 'Products', path: '/products', icon: <ShoppingBag className="h-5 w-5" /> },
  { name: 'Categories', path: '/categories', icon: <Tag className="h-5 w-5" /> },
  { name: 'Shops', path: '/shops', icon: <Store className="h-5 w-5" /> },
];

const featuredCategories = [
  { name: 'New Arrivals', path: '/categories', icon: <SparklesIcon className="h-5 w-5" /> },
  { name: 'Best Sellers', path: '/products', icon: <Star className="h-5 w-5" /> },
  { name: 'Offers', path: '/offers', icon: <Gift className="h-5 w-5" /> },
  { name: 'Cart', path: '/cart', icon: <SparklesIcon className="h-5 w-5" /> },
];

const userFeatures = [
  { name: 'My Orders', path: '/account/orders', icon: <ShoppingCart className="h-5 w-5" /> },
  { name: 'Wishlist', path: '/account/wishlist', icon: <Heart className="h-5 w-5" /> },
  { name: 'Notifications', path: '/notifications', icon: <Bell className="h-5 w-5" /> },
  { name: 'Settings', path: '/account/settings', icon: <Settings className="h-5 w-5" /> },
];

const additionalFeatures = [
  { name: 'Become a Partner', path: '/partner', icon: <Users className="h-5 w-5" /> },
  { name: 'Help & Support', path: '/help', icon: <HelpCircle className="h-5 w-5" /> },
  { name: 'Account Settings', path: '/account/settings', icon: <Settings className="h-5 w-5" /> },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode, setTheme } = useTheme();
  const { currentUser, logout } = useAuth(); // Add this line
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Add this function
  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Animated variants
  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const charVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const glowVariants = {
    initial: { opacity: 0.5, scale: 0.9 },
    animate: { 
      opacity: [0.5, 0.8, 0.5],
      scale: [0.9, 1.05, 0.9],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut"
      }
    }
  };

  const searchVariants = {
    closed: { width: "40px", transition: { duration: 0.3 } },
    open: { width: "250px", transition: { duration: 0.3 } }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled 
          ? isDarkMode 
            ? 'bg-gray-900/90 backdrop-blur-md shadow-md shadow-black/10' 
            : 'bg-white/90 backdrop-blur-md shadow-md shadow-black/5'
          : isDarkMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
            : 'bg-gradient-to-r from-orange-50 to-amber-50'
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-1 relative">
            {/* Animated Glow Behind Logo */}
            <motion.div 
              className={cn(
                "absolute -inset-2 rounded-full blur-md",
                isDarkMode ? "bg-orange-700/20" : "bg-orange-300/30"
              )}
              variants={glowVariants}
              initial="initial"
              animate="animate"
            />
            
            {/* Main Logo */}
            <motion.div 
              className="flex items-center relative z-10"
              variants={logoVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Sun Icon */}
              <motion.div variants={charVariants}>
                <Sun className={cn(
                  "h-5 w-5 mr-1", 
                  isDarkMode ? "text-orange-400" : "text-amber-500"
                )} />
              </motion.div>
              
              {/* Animated Characters */}
              <div className="flex">
                {['V', 'Y', 'O', 'M', 'A'].map((char, index) => (
                  <motion.span 
                    key={index} 
                    variants={charVariants}
                    className={cn(
                      "text-xl font-bold tracking-tighter",
                      isDarkMode ? "text-orange-300" : "text-orange-600"
                    )}
                    whileHover={{ 
                      scale: 1.2, 
                      color: isDarkMode ? "#ff9500" : "#ff6b00",
                      rotate: [-5, 5, 0],
                      transition: { duration: 0.3 }
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
              
              {/* Animated Sparkles */}
              <motion.div 
                className="absolute -top-1 -right-2"
                variants={sparkleVariants}
                initial="initial"
                animate="animate"
              >
                <Sparkles className={cn(
                  "h-3 w-3", 
                  isDarkMode ? "text-orange-300" : "text-amber-500"
                )} />
              </motion.div>
            </motion.div>
          </Link>

          {/* Action Items */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <motion.form 
              onSubmit={handleSearch}
              className="relative hidden md:flex items-center"
              initial="closed"
              animate={searchOpen ? "open" : "closed"}
              variants={searchVariants}
            >
              <Input
                type="text"
                placeholder={searchOpen ? "Search..." : ""}
                className={cn(
                  "h-9 pr-8 transition-all",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-700 placeholder:text-gray-500" 
                    : "bg-orange-50 border-orange-100",
                  !searchOpen && "cursor-pointer pl-8",
                  searchOpen && "pl-3"
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => !searchQuery && setSearchOpen(false), 200)}
              />
              <Button 
                type={searchOpen ? "submit" : "button"}
                variant="ghost" 
                size="icon" 
                className={cn(
                  "absolute", 
                  searchOpen ? "right-0" : "left-0",
                  isDarkMode 
                    ? "hover:bg-gray-700 text-gray-400" 
                    : "hover:bg-orange-100 text-orange-500"
                )}
                onClick={() => !searchOpen && setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </motion.form>

            {/* Only show search icon on mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "md:hidden", 
                isDarkMode ? "text-gray-300" : "text-orange-600"
              )}
              onClick={() => navigate('/search')}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notification Badge */}
            <NotificationBadge className={cn(
              isDarkMode ? "text-gray-300" : "text-orange-600"
            )} />

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className={cn(
                "relative overflow-hidden",
                isDarkMode ? "text-gray-300" : "text-orange-600"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Menu */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    isDarkMode ? "text-gray-300" : "text-orange-600"
                  )}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className={cn(
                "flex flex-col overflow-y-auto",
                isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
              )}>
                <SheetHeader className="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <SheetTitle className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-gray-100" : "text-gray-900"
                  )}>
                    Explore VYOMA
                  </SheetTitle>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Shops', value: '2.5K+' },
                      { label: 'Products', value: '50K+' },
                      { label: 'Users', value: '100K+' }
                    ].map((stat) => (
                      <div key={stat.label} className={cn(
                        "text-center p-2 rounded-lg",
                        isDarkMode ? "bg-gray-800" : "bg-orange-50"
                      )}>
                        <div className={cn(
                          "text-lg font-bold",
                          isDarkMode ? "text-orange-400" : "text-orange-600"
                        )}>{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </SheetHeader>

                <div className="flex flex-col space-y-6 mt-6">
                  {/* Featured Categories */}
                  <div className="space-y-3">
                    <h3 className={cn(
                      "text-sm font-medium flex items-center gap-2",
                      isDarkMode ? "text-orange-400" : "text-orange-600"
                    )}>
                      <Star className="h-4 w-4" />
                      Featured
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {featuredCategories.map((category) => (
                        <Button
                          key={category.path}
                          variant="outline"
                          className={cn(
                            "h-24 flex flex-col items-center justify-center gap-2",
                            isDarkMode 
                              ? "bg-gray-800 hover:bg-gray-700 border-gray-700" 
                              : "bg-orange-50 hover:bg-orange-100 border-orange-100"
                          )}
                          onClick={() => {
                            navigate(category.path);
                            setMenuOpen(false);
                          }}
                        >
                          {category.icon}
                          <span className="text-sm">{category.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-3">
                    <h3 className={cn(
                      "text-sm font-medium flex items-center gap-2",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      <Compass className="h-4 w-4" />
                      Navigation
                    </h3>
                    {navigationLinks.map((link) => (
                      <Button
                        key={link.path}
                        variant="ghost"
                        className={cn(
                          "justify-start w-full gap-3 h-12",
                          isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
                          location.pathname === link.path && (
                            isDarkMode 
                              ? "bg-gray-800 text-orange-400" 
                              : "bg-orange-50 text-orange-600"
                          )
                        )}
                        onClick={() => {
                          navigate(link.path);
                          setMenuOpen(false);
                        }}
                      >
                        {link.icon}
                        {link.name}
                      </Button>
                    ))}
                  </div>

                  {/* User Features */}
                  {currentUser && (
                    <div className="space-y-2">
                      <h3 className={cn(
                        "text-sm font-medium",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}>My Account</h3>
                      {userFeatures.map((feature) => (
                        <Button
                          key={feature.path}
                          variant="ghost"
                          className={cn(
                            "justify-start w-full gap-3",
                            isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                          )}
                          onClick={() => {
                            navigate(feature.path);
                            setMenuOpen(false);
                          }}
                        >
                          {feature.icon}
                          {feature.name}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Additional Features */}
                  <div className="space-y-2">
                    <h3 className={cn(
                      "text-sm font-medium",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>More</h3>
                    {additionalFeatures.map((feature) => (
                      <Button
                        key={feature.path}
                        variant="ghost"
                        className={cn(
                          "justify-start w-full gap-3",
                          isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        )}
                        onClick={() => {
                          navigate(feature.path);
                          setMenuOpen(false);
                        }}
                      >
                        {feature.icon}
                        {feature.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-0.5",
        isDarkMode 
          ? "bg-gradient-to-r from-transparent via-orange-800/30 to-transparent" 
          : "bg-gradient-to-r from-transparent via-orange-200 to-transparent"
      )} />
    </header>
  );
}


export default Navigation;