
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Home, 
  Store, 
  Package, 
  Bell, 
  Sun, 
  Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MobileNav from './MobileNav';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from '@/components/ThemeToggle';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import NotificationDropdown from '@/components/NotificationDropdown';
import { useNotifications } from '@/contexts/NotificationContext';

export function Navigation() {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { cartItems } = useCart();
  const { currentUser } = useAuth();
  const { unreadCount } = useNotifications();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        isScrolled || isDarkMode
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm shadow-sm'
          : 'bg-gradient-to-r from-orange-700 to-orange-900'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="relative">
                <div className={cn(
                  "absolute inset-0 animate-pulse-subtle opacity-40 blur-md rounded-full",
                  isDarkMode ? "bg-orange-500" : "bg-orange-300"
                )} />
                <div className="relative flex items-center">
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-orange-300 mr-1.5 animate-float" />
                  ) : (
                    <Sun className="h-5 w-5 text-orange-200 mr-1.5 animate-float" />
                  )}
                  <Sparkles className={cn(
                    "h-3 w-3 absolute ml-1 -mt-2.5 animate-pulse-subtle",
                    isDarkMode ? "text-orange-300" : "text-orange-200"
                  )} />
                </div>
              </div>
              <div className="ml-1">
                <h1 className={cn(
                  "text-lg font-bold relative",
                  isDarkMode ? "text-orange-300" : "text-orange-200"
                )}>
                  VYOMA
                  <span className={cn(
                    "absolute -top-1 right-0 h-1.5 w-1.5 rounded-full",
                    isDarkMode ? "bg-orange-300" : "bg-orange-200"
                  )}></span>
                  <Sparkles className={cn(
                    "h-2 w-2 absolute -top-1 -right-3 animate-pulse-subtle",
                    isDarkMode ? "text-orange-300" : "text-orange-200" 
                  )} />
                </h1>
                <p className={cn(
                  "text-xs",
                  isDarkMode ? "text-orange-200/70" : "text-orange-200/90"
                )}>Welcome back!</p>
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              to="/"
              className={cn(
                'flex items-center text-sm font-medium transition-colors',
                location.pathname === '/'
                  ? 'text-white font-semibold'
                  : 'text-orange-200/80 hover:text-white'
              )}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={cn(
                'flex items-center text-sm font-medium transition-colors',
                location.pathname.startsWith('/products')
                  ? 'text-white font-semibold'
                  : 'text-orange-200/80 hover:text-white'
              )}
            >
              Products
            </Link>
            <Link
              to="/shops"
              className={cn(
                'flex items-center text-sm font-medium transition-colors',
                location.pathname.startsWith('/shops')
                  ? 'text-white font-semibold'
                  : 'text-orange-200/80 hover:text-white'
              )}
            >
              Shops
            </Link>
            <Link
              to="/offers"
              className={cn(
                'flex items-center text-sm font-medium transition-colors',
                location.pathname === '/offers'
                  ? 'text-white font-semibold'
                  : 'text-orange-200/80 hover:text-white'
              )}
            >
              Offers
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/search"
            className={cn(
              'rounded-md p-2 text-orange-200/80 transition-colors hover:text-white',
              location.pathname.startsWith('/search') && 'text-white'
            )}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Link>
          
          {currentUser && (
            <NotificationDropdown>
              <Button variant="ghost" size="icon" className="relative text-orange-200/80 hover:text-white hover:bg-transparent">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </NotificationDropdown>
          )}

          <Link
            to="/cart"
            className={cn(
              'rounded-md p-2 text-orange-200/80 transition-colors hover:text-white relative',
              location.pathname.startsWith('/cart') && 'text-white'
            )}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <Badge 
                variant="default" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-orange-500"
              >
                {cartItems.length > 9 ? '9+' : cartItems.length}
              </Badge>
            )}
            <span className="sr-only">Cart</span>
          </Link>
          
          <Link
            to={currentUser ? '/account' : '/login'}
            className={cn(
              'rounded-md p-2 text-orange-200/80 transition-colors hover:text-white',
              (location.pathname.startsWith('/account') || location.pathname.startsWith('/login')) && 'text-white'
            )}
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Link>
          
          <ThemeToggle />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-orange-200/80 hover:text-white hover:bg-transparent">
                <Packages className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="md:hidden">
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
