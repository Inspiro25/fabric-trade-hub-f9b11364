
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/search/AuthDialog';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const RequireAuth = ({ children, redirectTo = '/auth' }: RequireAuthProps) => {
  const { currentUser, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Only show dialog if not loading and user is not authenticated
    if (!loading) {
      if (currentUser) {
        setShowContent(true);
      } else {
        setShowAuthDialog(true);
        setShowContent(false);
      }
    }
  }, [currentUser, loading]);

  const handleLogin = () => {
    // Use window.location for navigation instead of useNavigate
    window.location.href = redirectTo;
  };

  // Don't render anything until auth check is complete
  if (loading) {
    return null;
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
