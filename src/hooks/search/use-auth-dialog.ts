
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function useAuthDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { currentUser } = useAuth();

  const openAuthDialog = () => {
    if (!currentUser) {
      setIsDialogOpen(true);
      return true;
    }
    return false;
  };

  const closeAuthDialog = () => {
    setIsDialogOpen(false);
  };

  const handleLogin = () => {
    window.location.href = '/auth';
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    openAuthDialog,
    closeAuthDialog,
    handleLogin,
    isAuthenticated: !!currentUser
  };
}
