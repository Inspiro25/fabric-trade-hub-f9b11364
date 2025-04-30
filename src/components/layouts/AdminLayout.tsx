
import React from 'react';
import { 
  ShoppingBag, 
  Settings, 
  LogOut, 
  BarChart3,
  Users, 
  Package,
  Bell,
  Search,
  Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout, userProfile } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="flex-grow p-4 space-y-1">
          <Link to="/admin/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <BarChart3 className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/products" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Package className="mr-3 h-5 w-5" />
            <span>Products</span>
          </Link>
          <Link to="/admin/orders" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <ShoppingBag className="mr-3 h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link to="/admin/customers" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Users className="mr-3 h-5 w-5" />
            <span>Customers</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Log Out</span>
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-4 py-2 flex items-center justify-between">
          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">Admin Panel</h2>
                </div>
                
                <nav className="p-4 space-y-1">
                  <Link to="/admin/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <BarChart3 className="mr-3 h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/admin/products" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <Package className="mr-3 h-5 w-5" />
                    <span>Products</span>
                  </Link>
                  <Link to="/admin/orders" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <ShoppingBag className="mr-3 h-5 w-5" />
                    <span>Orders</span>
                  </Link>
                  <Link to="/admin/customers" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <Users className="mr-3 h-5 w-5" />
                    <span>Customers</span>
                  </Link>
                  <Link to="/admin/settings" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <Settings className="mr-3 h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>
                
                <div className="p-4 border-t mt-auto">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>Log Out</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Search */}
          <div className="hidden md:flex md:w-1/3">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full"
              />
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {userProfile?.displayName?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-grow overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
