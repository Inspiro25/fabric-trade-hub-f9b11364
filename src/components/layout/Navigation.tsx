
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import NotificationBadge from '@/components/features/NotificationBadge';
import { motion, AnimatePresence } from 'framer-motion';
import MobileNav from './MobileNav';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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
                isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
              )}>
                <MobileNav onClose={() => setMenuOpen(false)} />
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
