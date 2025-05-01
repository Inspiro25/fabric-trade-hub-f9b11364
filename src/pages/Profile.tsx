import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

// Importing refactored components
import ProfileHeader from '@/components/profile/ProfileHeader';
import GuestView from '@/components/profile/GuestView';
import AuthenticatedView from '@/components/profile/AuthenticatedView';

const ProfilePage = () => {
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const { getCartCount } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [editMode, setEditMode] = useState(false);
  
  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Scroll to top and trigger animations
    window.scrollTo(0, 0);
    
    // Populate form fields with user data
    if (currentUser) {
      setDisplayName(currentUser.displayName || userProfile?.displayName || '');
      setEmail(currentUser.email || userProfile?.email || '');
      setPhoneNumber(currentUser?.phone || (currentUser?.user_metadata?.phone) || userProfile?.phone || '');
      setAddress(currentUser?.address || (currentUser?.user_metadata?.address) || userProfile?.address || '');
    }
    
    // Set animation state after a short delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentUser, userProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('You need to log in to update your profile');
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updateUserProfile({
        displayName,
        email,
        phone: phoneNumber,
        address: address
      });
      
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`pb-16 min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      <ProfileHeader 
        isLoggedIn={!!currentUser} 
        editMode={editMode} 
        setEditMode={currentUser ? setEditMode : undefined} 
      />
      
      {!currentUser ? (
        <GuestView isLoaded={isLoaded} />
      ) : (
        <AuthenticatedView
          isLoaded={isLoaded}
          currentUser={currentUser as any}
          displayName={displayName}
          setDisplayName={setDisplayName}
          email={email}
          setEmail={setEmail}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          address={address}
          setAddress={setAddress}
          editMode={editMode}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          handleLogout={handleLogout}
          getCartCount={getCartCount}
        />
      )}
    </div>
  );
};

export default ProfilePage;
