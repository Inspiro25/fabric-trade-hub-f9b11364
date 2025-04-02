
import { useState } from 'react';

export function useAuthDialog() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<'login' | 'register'>('login');
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);
  
  const openAuthDialog = (mode: 'login' | 'register' = 'login', redirectPath: string | null = null) => {
    setAuthDialogMode(mode);
    setIsAuthDialogOpen(true);
    if (redirectPath) {
      setRedirectAfterAuth(redirectPath);
    }
  };
  
  const closeAuthDialog = () => {
    setIsAuthDialogOpen(false);
  };
  
  return {
    isAuthDialogOpen,
    authDialogMode,
    redirectAfterAuth,
    openAuthDialog,
    closeAuthDialog,
    setAuthDialogMode,
  };
}

export default useAuthDialog;
