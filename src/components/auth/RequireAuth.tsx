
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/search/AuthDialog';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const RequireAuth = ({ children, redirectTo = '/auth' }: RequireAuthProps) => {
  const { currentUser, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const navigate = useNavigate();

  // Double-check Supabase session to be extra sure
  useEffect(() => {
    const checkSupabaseSession = async () => {
      try {
        console.log("RequireAuth: Double-checking Supabase session");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("RequireAuth: Valid Supabase session found for user:", session.user.id);
          
          // If we have a Supabase session but no currentUser, this indicates a potential issue
          if (!currentUser && !loading) {
            console.log("RequireAuth: Supabase session exists but currentUser is null, refreshing page");
            // Force reload to sync auth state
            window.location.reload();
            return;
          }
          
          setShowContent(true);
          setShowAuthDialog(false);
        } else {
          console.log("RequireAuth: No valid Supabase session found");
          setShowContent(false);
          setShowAuthDialog(true);
        }
        
        setLocalLoading(false);
      } catch (error) {
        console.error("RequireAuth: Error checking Supabase session", error);
        toast.error("Authentication error. Please try again.");
        setLocalLoading(false);
        setShowContent(false);
        setShowAuthDialog(true);
      }
    };
    
    if (!loading) {
      checkSupabaseSession();
    }
  }, [currentUser, loading]);

  const handleLogin = () => {
    setShowAuthDialog(false);
    navigate(redirectTo);
  };

  // Show a smoother loading experience
  if (loading || localLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {showContent && children}
      
      {showAuthDialog && (
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onLogin={handleLogin}
          title="Authentication Required"
          message="You need to be logged in to access this feature."
        />
      )}
    </>
  );
};

export default RequireAuth;
