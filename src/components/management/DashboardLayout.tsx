import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Layout, 
  LogOut, 
  Home, 
  Store, 
  Users, 
  Settings, 
  PieChart, 
  AlertTriangle, 
  ChevronLeft,
  Tag,
  Menu,
  X,
  Bell,
  Search,
  HelpCircle,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string>('');
  const [adminRole, setAdminRole] = useState<string>('');
  const [activePath, setActivePath] = useState('/management/dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3); // Example notification count
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Don't check authentication on the login page
    if (location.pathname === '/management/login') {
      return;
    }
    
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
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminUsername');
    sessionStorage.removeItem('adminRole');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    
    navigate('/management/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const NavItem = ({ path, icon: Icon, label, isMobile = false, badge }: { 
    path: string; 
    icon: React.ElementType; 
    label: string;
    isMobile?: boolean;
    badge?: number;
  }) => (
    <li>
      <Link
        to={path}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all relative",
          activePath === path 
            ? isDarkMode 
              ? "bg-gray-800 text-orange-400 font-medium" 
              : "bg-gray-100 text-purple-600 font-medium"
            : isDarkMode
              ? "text-gray-400 hover:bg-gray-800"
              : "text-gray-600 hover:bg-gray-100",
          isMobile && "text-base py-3"
        )}
        onClick={() => {
          setActivePath(path);
          if (isMobile) {
            setIsMobileNavOpen(false);
          }
        }}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
        {badge && (
          <Badge 
            variant="secondary" 
            className={cn(
              "ml-auto",
              isDarkMode ? "bg-orange-400/20 text-orange-400" : "bg-purple-100 text-purple-600"
            )}
          >
            {badge}
          </Badge>
        )}
      </Link>
    </li>
  );

  const Navigation = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className="grid items-start px-4 text-sm font-medium">
      <ul className="space-y-1">
        <NavItem path="/management/dashboard" icon={Home} label="Dashboard" isMobile={isMobile} />
        <NavItem path="/management/analytics" icon={BarChart3} label="Analytics" isMobile={isMobile} />
        <NavItem path="/management/shops" icon={Store} label="Shops" isMobile={isMobile} />
        <NavItem path="/management/offers" icon={Tag} label="Offers" isMobile={isMobile} />
        <NavItem path="/management/partner" icon={Users} label="Partner" isMobile={isMobile} badge={2} />
      </ul>
    </nav>
  );

  const UserProfile = () => (
    <div className="flex items-center gap-2 rounded-lg p-2">
      <Avatar>
        <AvatarFallback className={cn(
          isDarkMode ? "bg-gray-800 text-orange-400" : "bg-purple-100 text-purple-600"
        )}>
          {username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col overflow-hidden">
        <span className={cn(
          "text-sm font-medium",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          {username}
        </span>
        <span className={cn(
          "text-xs",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          Main Administrator
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-8 w-8",
                  isDarkMode && "hover:bg-gray-800"
                )}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Help</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Need help?</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button 
          variant="outline" 
          size="icon" 
          className={cn(
            "h-8 w-8",
            isDarkMode && "border-gray-700 hover:bg-gray-800"
          )} 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </div>
  );

  // If we're on the login page, just render the outlet
  if (location.pathname === '/management/login') {
    return <Outlet />;
  }

  // If not authenticated and not on login page, don't render anything
  if (!username || !adminRole) {
    return null;
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden border-r lg:block",
        isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-gray-50 border-gray-200"
      )}>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className={cn(
            "flex h-14 items-center border-b px-4",
            isDarkMode ? "border-gray-800" : "border-gray-200"
          )}>
            <Link 
              to="/management/dashboard" 
              className={cn(
                "flex items-center gap-2 font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
              onClick={() => setActivePath('/management/dashboard')}
            >
              <Layout className="h-6 w-6" />
              <span>Management Portal</span>
            </Link>
          </div>
          <div className="px-4 py-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-8",
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                )}
              />
            </form>
          </div>
          <ScrollArea className="flex-1 py-2">
            <Navigation />
          </ScrollArea>
          <div className={cn(
            "mt-auto border-t p-4",
            isDarkMode ? "border-gray-800" : "border-gray-200"
          )}>
            <UserProfile />
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <header className={cn(
        "sticky top-0 z-50 flex h-14 items-center gap-4 border-b px-4 lg:hidden",
        isDarkMode 
          ? "bg-gray-900 border-gray-800 text-white" 
          : "bg-white border-gray-200"
      )}>
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className={cn(
                "h-8 w-8",
                isDarkMode && "border-gray-700 hover:bg-gray-800"
              )}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className={cn(
              "w-[280px] p-0",
              isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white"
            )}
          >
            <SheetHeader className={cn(
              "h-14 border-b px-4 flex items-center",
              isDarkMode ? "border-gray-800" : "border-gray-200"
            )}>
              <SheetTitle className={cn(
                "flex items-center gap-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                <Layout className="h-6 w-6" />
                Management Portal
              </SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "pl-8",
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  )}
                />
              </form>
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="flex flex-col gap-4 py-4">
                <Navigation isMobile />
              </div>
            </ScrollArea>
            <div className={cn(
              "absolute bottom-0 left-0 right-0 border-t p-4",
              isDarkMode ? "border-gray-800" : "border-gray-200"
            )}>
              <UserProfile />
            </div>
          </SheetContent>
        </Sheet>
        <div className="font-semibold">Management Portal</div>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 relative",
              isDarkMode && "hover:bg-gray-800"
            )}
          >
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center",
                  isDarkMode ? "bg-orange-400/20 text-orange-400" : "bg-purple-100 text-purple-600"
                )}
              >
                {notifications}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className={cn(
              "h-8 w-8",
              isDarkMode && "border-gray-700 hover:bg-gray-800"
            )} 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className={cn(
        "flex flex-col",
        isDarkMode ? "bg-gray-950" : "bg-white"
      )}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
