
import { useState } from 'react';

export const useSearchDialogs = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');

  const handleLogin = () => {
    setIsDialogOpen(false);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    shareableLink,
    setShareableLink,
    handleLogin
  };
};
