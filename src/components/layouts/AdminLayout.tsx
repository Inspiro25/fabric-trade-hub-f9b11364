
import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { 
  BarChart3, 
  Layout, 
  LogOut, 
  Home, 
  Store, 
  Users, 
  Settings, 
  ChevronLeft,
  Tag,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

const navigation = [
  { name: 'Dashboard', href: '/management/dashboard', icon: Home },
  { name: 'Analytics', href: '/management/analytics', icon: BarChart3 },
  { name: 'Shops', href: '/management/shops', icon: Store },
  { name: 'Offers', href: '/management/offers', icon: Tag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Users', href: '/management/users', icon: Users },
  { name: 'Settings', href: '/management/settings', icon: Settings }
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [adminRole, setAdminRole] = useState<string>('');
  const [activePath, setActivePath] = useState('/management/dashboard');

  useEffect(() => {
    // Check if user is authenticated as a main admin
    const storedUsername = sessionStorage.getItem('adminUsername');
    const storedRole = sessionStorage.getItem('adminRole');
    
    if (!storedUsername || !storedRole || storedRole !== 'main') {
      toast({
        title: "Access denied",
        description: "You must be logged in as an administrator",
        variant: "destructive"
      });
      navigate('/management/login');
      return;
    }
    
    setUsername(storedUsername);
    setAdminRole(storedRole);
    
    // Set active path based on current location
    setActivePath(window.location.pathname);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminUsername');
    sessionStorage.removeItem('adminRole');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    
    navigate('/management/login');
  };

  const NavItem = ({ path, icon: Icon, label }: { path: string; icon: React.ElementType; label: string }) => (
    <li>
      <Link
        to={path}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${
          activePath === path ? 'bg-gray-100 dark:bg-gray-800 text-purple-600 font-medium' : 'text-gray-600 dark:text-gray-400'
        }`}
        onClick={() => setActivePath(path)}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    </li>
  );

  if (!username || !adminRole) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-gray-50 dark:bg-gray-900/50 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link 
              to="/management/dashboard" 
              className="flex items-center gap-2 font-semibold"
              onClick={() => setActivePath('/management/dashboard')}
            >
              <Layout className="h-6 w-6" />
              <span>Management Portal</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <NavItem 
                    key={item.name}
                    path={item.href} 
                    icon={item.icon} 
                    label={item.name} 
                  />
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-2 rounded-lg p-2">
              <Avatar>
                <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium">{username}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Main Administrator</span>
              </div>
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 lg:hidden">
        <Button variant="outline" size="icon" asChild className="h-8 w-8">
          <Link to="/">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="font-semibold">Management Portal</div>
        <Button variant="outline" size="icon" className="ml-auto h-8 w-8" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </header>
      
      {/* Main content */}
      <main className="flex flex-col bg-white dark:bg-gray-950">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
