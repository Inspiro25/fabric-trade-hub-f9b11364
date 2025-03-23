
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

  useEffect(() => {
    // Only show dialog if not loading and user is not authenticated
    if (!loading && !currentUser) {
      setShowAuthDialog(true);
    }
  }, [currentUser, loading]);

  const handleLogin = () => {
    // Use window.location for navigation instead of useNavigate
    window.location.href = redirectTo;
  };

  // Don't render children until auth check is complete
  if (loading) {
    return null;
  }

  // If user is authenticated, render children
  if (currentUser) {
    return <>{children}</>;
  }

  // Show auth dialog if user is not authenticated
  return (
    <>
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
