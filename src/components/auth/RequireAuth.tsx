
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { ExtendedUser } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  shopAdminOnly?: boolean;
  redirectTo?: string;
}

const RequireAuth = ({ 
  children, 
  adminOnly = false, 
  shopAdminOnly = false,
  redirectTo = '/auth/login' 
}: RequireAuthProps) => {
  const { currentUser, isLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  
  // Check if user has required role for protected routes
  const hasRequiredRole = () => {
    if (!adminOnly && !shopAdminOnly) return true;
    
    // Admin-only routes
    if (adminOnly) {
      return currentUser?.role === 'admin' || currentUser?.preferences?.role === 'admin';
    }
    
    // Shop admin routes
    if (shopAdminOnly) {
      return currentUser?.role === 'shop_admin' || currentUser?.preferences?.role === 'shop_admin' ||
             currentUser?.role === 'admin' || currentUser?.preferences?.role === 'admin';
    }
    
    return false;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isLoading) {
          // No current user, redirect to login
          if (!currentUser) {
            navigate(redirectTo, { state: { from: location.pathname } });
            return;
          }
          
          // If user doesn't have required role
          if (!hasRequiredRole()) {
            toast({
              title: "Access denied",
              description: "You don't have permission to access this page",
              variant: "destructive"
            });
            navigate('/');
            return;
          }
          
          setLocalLoading(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate(redirectTo, { state: { from: location.pathname } });
      }
    };

    checkAuth();
  }, [currentUser, isLoading, navigate, location.pathname, redirectTo]);

  // Show loading state
  if (isLoading || localLoading) {
    return (
      <div className={cn(
        "flex items-center justify-center min-h-screen",
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      )}>
        <div className="text-center">
          <Loader2 className={cn(
            "h-8 w-8 animate-spin mx-auto",
            isDarkMode ? "text-blue-400" : "text-blue-600"
          )} />
          <p className={cn(
            "mt-4 text-sm",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            Verifying your access...
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default RequireAuth;
