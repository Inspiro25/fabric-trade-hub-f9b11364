
import { useState } from 'react';

export const useAuthDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');

  const openAuthDialog = () => setIsDialogOpen(true);
  const openLoginDialog = () => setIsDialogOpen(true);
  const closeLoginDialog = () => setIsDialogOpen(false);
  
  const openShareDialog = (link?: string) => {
    if (link) setShareableLink(link);
    setIsShareDialogOpen(true);
  };
  
  const closeShareDialog = () => setIsShareDialogOpen(false);

  return {
    isDialogOpen,
    setIsDialogOpen,
    openAuthDialog,
    openLoginDialog,
    closeLoginDialog,
    isShareDialogOpen,
    setIsShareDialogOpen,
    openShareDialog,
    closeShareDialog,
    shareableLink,
    setShareableLink
  };
};

export default useAuthDialog;
