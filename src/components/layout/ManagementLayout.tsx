
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  BarChart3, 
  Store, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Moon, 
  Sun,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ManagementLayout: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleLogout = () => {
    // Implement logout functionality here
    navigate('/');
  };
  
  const navItems = [
    { title: 'Dashboard', path: '/management/dashboard', icon: <BarChart3 className="h-5 w-5" /> },
    { title: 'Shops', path: '/management/shops', icon: <Store className="h-5 w-5" /> },
    { title: 'Categories', path: '/management/categories', icon: <Package className="h-5 w-5" /> },
    { title: 'Users', path: '/management/users', icon: <Users className="h-5 w-5" /> },
    { title: 'Settings', path: '/management/settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  return (
    <div className={cn("flex min-h-screen", isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800")}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-30 h-full w-64 transform transition-transform duration-300 ease-in-out",
        isDarkMode ? "bg-gray-800" : "bg-white",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-3 rounded-lg transition",
                    isActive 
                      ? isDarkMode 
                        ? "bg-gray-700 text-white" 
                        : "bg-gray-100 text-blue-600" 
                      : isDarkMode 
                        ? "hover:bg-gray-700" 
                        : "hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span>Dark Mode</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme} 
              className="ml-auto"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "lg:ml-64" : "ml-0 lg:ml-64"
      )}>
        {/* Topbar */}
        <header className={cn(
          "h-16 flex items-center justify-between px-4 border-b sticky top-0 z-10",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="mr-2"
            >
              View Store
            </Button>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagementLayout;
