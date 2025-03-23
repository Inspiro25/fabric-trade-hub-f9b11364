
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/search/AuthDialog';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
        
        // If we have a Supabase session but no currentUser, this indicates a potential issue
        if (session && !currentUser && !loading) {
          console.log("RequireAuth: Supabase session exists but currentUser is null, refreshing auth state");
          window.location.reload(); // Force refresh to sync auth state
          return;
        }
        
        setLocalLoading(false);
      } catch (error) {
        console.error("RequireAuth: Error checking Supabase session", error);
        setLocalLoading(false);
      }
    };
    
    if (!loading) {
      checkSupabaseSession();
    }
  }, [currentUser, loading]);

  useEffect(() => {
    // Only show dialog if not loading and user is not authenticated
    if (!loading && !localLoading) {
      if (currentUser) {
        console.log("RequireAuth: User is authenticated, showing content");
        setShowContent(true);
        setShowAuthDialog(false);
      } else {
        console.log("RequireAuth: User is not authenticated, showing auth dialog");
        setShowAuthDialog(true);
        setShowContent(false);
      }
    }
  }, [currentUser, loading, localLoading]);

  const handleLogin = () => {
    // Close the dialog first
    setShowAuthDialog(false);
    // Use navigate for client-side routing
    navigate(redirectTo);
  };

  // Don't render anything until auth check is complete
  if (loading || localLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
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
