
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, Search, ShoppingCart, User, Home, Store, Package, Heart, Bell } from 'lucide-react';
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

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/shops', label: 'Shops', icon: Store },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        isScrolled || isDarkMode
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl md:text-2xl">
              Kutuku
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center text-sm font-medium transition-colors hover:text-foreground/80',
                  isActive(item.href)
                    ? 'text-foreground font-semibold'
                    : 'text-foreground/60'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/search"
            className={cn(
              'rounded-md p-2 text-muted-foreground transition-colors',
              isActive('/search')
                ? 'bg-muted text-foreground'
                : 'hover:bg-muted hover:text-foreground'
            )}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Link>
          
          {currentUser && (
            <NotificationDropdown>
              <Button variant="ghost" size="icon" className="relative">
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
              'rounded-md p-2 text-muted-foreground transition-colors relative',
              isActive('/cart')
                ? 'bg-muted text-foreground'
                : 'hover:bg-muted hover:text-foreground'
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
              'rounded-md p-2 text-muted-foreground transition-colors',
              isActive('/account') || isActive('/login')
                ? 'bg-muted text-foreground'
                : 'hover:bg-muted hover:text-foreground'
            )}
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Link>
          
          <ThemeToggle />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="md:hidden">
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="border-b"></div>
      
      {/* Admin links bar */}
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-1 text-xs flex justify-center">
        <div className="container flex justify-between">
          <span className="text-muted-foreground">
            Marketplace by Kutuku
          </span>
          <div className="flex gap-4">
            <Link 
              to="/admin/login" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Shop Admin
            </Link>
            <Link 
              to="/management/login" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Management
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
