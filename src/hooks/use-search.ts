
import { useState, useCallback } from 'react';

export const useSearchDialogs = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  
  // Add the missing handleLogin function
  const handleLogin = useCallback(() => {
    window.location.href = '/auth';
  }, []);
  
  // Function to copy shareable link to clipboard
  const copyToClipboard = useCallback(() => {
    try {
      navigator.clipboard.writeText(shareableLink);
      return true;
    } catch (error) {
      console.error('Failed to copy link:', error);
      return false;
    }
  }, [shareableLink]);
  
  return {
    isDialogOpen,
    setIsDialogOpen,
    isShareDialogOpen, 
    setIsShareDialogOpen,
    shareableLink,
    setShareableLink,
    handleLogin,
    copyToClipboard
  };
};

export const useSearchViewMode = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  }, []);
  
  return { viewMode, setViewMode, toggleViewMode };
};
