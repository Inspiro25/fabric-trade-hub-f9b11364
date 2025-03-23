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
import { toast } from 'sonner';

export const useAuthProvider = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("Auth state changed:", user ? "Logged in" : "Logged out");
      setCurrentUser(user);
      
      if (user) {
        try {
          const profile = await fetchUserProfile(user.uid, user);
          setUserProfile(profile);
          console.log("User profile fetched:", profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("Failed to load user profile");
        }
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
      console.log("Attempting email login");
      const user = await loginWithEmailPassword(email, password);
      // Fetch user profile after login
      if (user) {
        const profile = await fetchUserProfile(user.uid, user);
        setUserProfile(profile);
      }
      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Attempting registration");
      const { profile } = await registerWithEmailPassword(email, password);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleProvider = async () => {
    setLoading(true);
    try {
      console.log("Attempting Google login");
      const { profile } = await loginWithGoogleAuth();
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebookProvider = async () => {
    setLoading(true);
    try {
      console.log("Attempting Facebook login");
      const { profile } = await loginWithFacebookAuth();
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error("Facebook login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword(email);
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  };

  const handleUpdateUserProfile = async (data: Partial<UserProfile>) => {
    try {
      const updatedProfile = await updateUserProfile(currentUser, userProfile, data);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
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
