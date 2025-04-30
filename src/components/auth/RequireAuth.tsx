
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { currentUser, userProfile, loading } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  
  // Check if user has required role for protected routes
  const hasRequiredRole = () => {
    if (!adminOnly && !shopAdminOnly) return true;
    
    // Admin-only routes
    if (adminOnly) {
      return userProfile?.preferences?.role === 'admin';
    }
    
    // Shop admin routes
    if (shopAdminOnly) {
      return userProfile?.preferences?.role === 'shop_admin' ||
             userProfile?.preferences?.role === 'admin';
    }
    
    return false;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Double-check Supabase session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!loading) {
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
  }, [currentUser, loading, navigate, location.pathname, redirectTo]);

  // Show loading state
  if (loading || localLoading) {
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
