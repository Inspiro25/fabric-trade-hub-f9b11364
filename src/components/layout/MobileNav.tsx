
import { Link } from 'react-router-dom';
import { Home, Package, Store, ShoppingCart, User, LogIn, Settings, Bell, Heart, LucideIcon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const MobileNav = () => {
  const { cartItems } = useCart();
  const { currentUser } = useAuth();
  const { unreadCount } = useNotifications();
  
  const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/shops', label: 'Shops', icon: Store },
    { 
      href: '/cart', 
      label: 'Cart', 
      icon: ShoppingCart,
      badge: cartItems.length
    }
  ];
  
  // Add account related items
  const accountItems: NavItem[] = currentUser 
    ? [
        { 
          href: '/account/notifications', 
          label: 'Notifications', 
          icon: Bell,
          badge: unreadCount
        },
        { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
        { href: '/account/settings', label: 'Settings', icon: Settings },
        { href: '/account', label: 'My Account', icon: User }
      ]
    : [
        { href: '/login', label: 'Login', icon: LogIn }
      ];
  
  // Add admin links
  const adminItems: NavItem[] = [
    { href: '/admin/login', label: 'Shop Admin', icon: Store },
    { href: '/management/login', label: 'Management', icon: Settings },
  ];

  return (
    <div className="space-y-6 py-4">
      <h2 className="text-lg font-semibold">Menu</h2>
      
      <div className="flex flex-col space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
            {item.badge && item.badge > 0 && (
              <Badge 
                variant="default" 
                className="ml-auto h-5 min-w-5 flex items-center justify-center p-0 text-[10px] bg-orange-500"
              >
                {item.badge > 9 ? '9+' : item.badge}
              </Badge>
            )}
          </Link>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <h2 className="px-3 text-sm font-semibold mb-3">Account</h2>
        <div className="flex flex-col space-y-3">
          {accountItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge 
                  variant="destructive" 
                  className="ml-auto h-5 min-w-5 flex items-center justify-center p-0 text-[10px]"
                >
                  {item.badge > 9 ? '9+' : item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h2 className="px-3 text-sm font-semibold mb-3">Admin Access</h2>
        <div className="flex flex-col space-y-3">
          {adminItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
