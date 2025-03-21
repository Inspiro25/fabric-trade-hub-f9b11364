
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserProfile } from '@/types/auth';
import { 
  fetchUserProfile, 
  updateUserProfile,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress, 
  loginWithEmailPassword, 
  registerWithEmailPassword, 
  loginWithGoogleAuth, 
  loginWithFacebookAuth, 
  logout, 
  forgotPassword 
} from '@/services/authService';

export const useAuthProvider = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const profile = await fetchUserProfile(user.uid, user);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await loginWithEmailPassword(email, password);
      // Fetch user profile after login
      if (user) {
        await fetchUserProfile(user.uid, user);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { profile } = await registerWithEmailPassword(email, password);
      setUserProfile(profile);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleProvider = async () => {
    setLoading(true);
    try {
      const { profile } = await loginWithGoogleAuth();
      setUserProfile(profile);
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebookProvider = async () => {
    setLoading(true);
    try {
      const { profile } = await loginWithFacebookAuth();
      setUserProfile(profile);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserProfile(null);
  };

  const handleForgotPassword = async (email: string) => {
    await forgotPassword(email);
  };

  const handleUpdateUserProfile = async (data: Partial<UserProfile>) => {
    const updatedProfile = await updateUserProfile(currentUser, userProfile, data);
    setUserProfile(updatedProfile);
  };

  const handleAddAddress = async (address: Omit<UserProfile['savedAddresses'][0], 'id'>) => {
    const addressId = await addAddress(currentUser, address);
    
    // Refresh user profile to get updated addresses
    if (currentUser) {
      const profile = await fetchUserProfile(currentUser.uid, currentUser);
      setUserProfile(profile);
    }
    
    return addressId;
  };

  const handleUpdateAddress = async (address: UserProfile['savedAddresses'][0]) => {
    await updateAddress(currentUser, address);
    
    // Refresh user profile to get updated addresses
    if (currentUser) {
      const profile = await fetchUserProfile(currentUser.uid, currentUser);
      setUserProfile(profile);
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    await removeAddress(currentUser, addressId);
    
    // Refresh user profile to get updated addresses
    if (currentUser) {
      const profile = await fetchUserProfile(currentUser.uid, currentUser);
      setUserProfile(profile);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    await setDefaultAddress(currentUser, addressId);
    
    // Refresh user profile to get updated addresses
    if (currentUser) {
      const profile = await fetchUserProfile(currentUser.uid, currentUser);
      setUserProfile(profile);
    }
  };

  return {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    loginWithGoogleProvider,
    loginWithFacebookProvider,
    logout: handleLogout,
    forgotPassword: handleForgotPassword,
    updateUserProfile: handleUpdateUserProfile,
    addAddress: handleAddAddress,
    updateAddress: handleUpdateAddress,
    removeAddress: handleRemoveAddress,
    setDefaultAddress: handleSetDefaultAddress,
  };
};
