import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Settings, ShoppingBag, Heart, Bell, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { getInitials } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const AccountDropdown = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const isLoggedIn = !!currentUser;
  const userName = userProfile?.displayName || currentUser?.email?.split('@')[0] || 'Guest';
  const userEmail = currentUser?.email || '';
  const avatarUrl = userProfile?.avatarUrl || '';

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "relative h-10 flex items-center gap-2 px-2 rounded-full transition-all",
            isDarkMode 
              ? "hover:bg-gray-800/70 text-orange-200 hover:text-orange-300" 
              : "hover:bg-orange-50 text-kutuku-primary hover:text-kutuku-secondary"
          )}
        >
          <Avatar className={cn(
            "h-8 w-8 border-2", 
            isDarkMode 
              ? "border-gray-700 bg-gray-800" 
              : "border-orange-100 bg-orange-50"
          )}>
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className={cn(
              "text-sm font-medium",
              isDarkMode 
                ? "bg-orange-900/30 text-orange-200" 
                : "bg-orange-100 text-orange-800"
            )}>
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="hidden sm:block text-start">
            <span className="text-xs font-medium">
              {isLoggedIn ? 'Account' : 'Sign In'}
            </span>
            <ChevronDown className="inline-block ml-1 h-3 w-3 opacity-70" />
          </div>
          
          {unreadCount > 0 && (
            <Badge className={cn(
              "absolute -top-1 -right-1 h-4 min-w-4 text-[10px] flex items-center justify-center rounded-full px-[5px] py-0 font-semibold",
              isDarkMode ? "bg-red-500 text-white" : "bg-red-500 text-white"
            )}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "w-56 p-2 z-50",
          isDarkMode ? "border-gray-700 bg-gray-800 text-gray-200" : "bg-white"
        )}
      >
        {isLoggedIn ? (
          <>
            <div className="p-2 mb-1">
              <div className="font-medium text-sm">{userName}</div>
              <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
            </div>
            
            <DropdownMenuItem asChild>
              <Link to="/account" className="flex items-center cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/account/orders" className="flex items-center cursor-pointer">
                <ShoppingBag className="h-4 w-4 mr-2" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/wishlist" className="flex items-center cursor-pointer">
                <Heart className="h-4 w-4 mr-2" />
                <span>Wishlist</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/notifications" className="flex items-center cursor-pointer">
                <Bell className="h-4 w-4 mr-2" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge className={cn(
                    "ml-auto h-5 px-1.5 text-xs font-medium",
                    isDarkMode ? "bg-red-500 text-white" : "bg-red-500 text-white"
                  )}>
                    {unreadCount}
                  </Badge>
                )}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/account/settings" className="flex items-center cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleLogout} 
              className={cn(
                "flex items-center cursor-pointer",
                isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600"
              )}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem 
              onClick={handleLogin} 
              className="cursor-pointer"
            >
              <User className="h-4 w-4 mr-2" />
              <span>Sign in / Register</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;
