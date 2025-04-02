
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useSearchDialogs() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const { currentUser } = useAuth();

  const handleLogin = () => {
    window.location.href = '/auth';
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareableLink,
    setShareableLink,
    isAuthenticated: !!currentUser,
    handleLogin
  };
}
