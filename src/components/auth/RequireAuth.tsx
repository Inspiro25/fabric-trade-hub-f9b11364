
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/search/AuthDialog';
import { useNavigate } from 'react-router-dom';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const RequireAuth = ({ children, redirectTo = '/auth' }: RequireAuthProps) => {
  const { currentUser, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only show dialog if not loading and user is not authenticated
    if (!loading) {
      if (currentUser) {
        setShowContent(true);
        setShowAuthDialog(false);
      } else {
        setShowAuthDialog(true);
        setShowContent(false);
      }
    }
  }, [currentUser, loading]);

  const handleLogin = () => {
    // Close the dialog first
    setShowAuthDialog(false);
    // Use navigate for client-side routing
    navigate(redirectTo);
  };

  // Don't render anything until auth check is complete
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
