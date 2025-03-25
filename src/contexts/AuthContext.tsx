
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  uid?: string; // Added for firebase compatibility
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
  };
  displayName?: string; // Added for firebase compatibility
  photoURL?: string; // Added for firebase compatibility
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  preferences?: {
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    theme?: string;
    currency?: string;
    language?: string;
  };
  savedAddresses?: {
    id: string;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
}

export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateProfile: (data: Partial<User>) => Promise<any>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>; // Alias for signIn
  register: (email: string, password: string, name?: string) => Promise<any>; // Alias for signUp
  logout: () => Promise<any>; // Alias for signOut
  updateUserProfile: (data: Partial<UserProfile>) => Promise<any>; // Alias for updateProfile
  loginWithGoogleProvider: () => Promise<any>;
  loginWithFacebookProvider: () => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => ({}),
  resetPassword: async () => ({}),
  updateProfile: async () => ({}),
  isAuthenticated: false,
  login: async () => ({}),
  register: async () => ({}),
  logout: async () => ({}),
  updateUserProfile: async () => ({}),
  loginWithGoogleProvider: async () => ({}),
  loginWithFacebookProvider: async () => ({}),
  forgotPassword: async () => ({}),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.info("Setting up auth state change listener");
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            uid: session.user.id, // Add uid for firebase compatibility
            email: session.user.email || '',
            user_metadata: session.user.user_metadata,
            displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            photoURL: session.user.user_metadata?.avatar_url,
          };
          
          setCurrentUser(userData);
          
          // Create userProfile for compatibility
          const userProfileData: UserProfile = {
            id: userData.id,
            email: userData.email,
            displayName: userData.displayName,
            avatarUrl: userData.photoURL,
          };
          
          setUserProfile(userProfileData);
          setIsAuthenticated(true);
          console.info("Auth state changed: Logged in");
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
          console.info("Auth state changed: Logged out");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setCurrentUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            uid: session.user.id, // Add uid for firebase compatibility
            email: session.user.email || '',
            user_metadata: session.user.user_metadata,
            displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            photoURL: session.user.user_metadata?.avatar_url,
          };
          
          setCurrentUser(userData);
          
          // Create userProfile for compatibility
          const userProfileData: UserProfile = {
            id: userData.id,
            email: userData.email,
            displayName: userData.displayName,
            avatarUrl: userData.photoURL,
          };
          
          setUserProfile(userProfileData);
          setIsAuthenticated(true);
          console.info("Auth state changed: Logged in");
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
          console.info("Auth state changed: Logged out");
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string = '') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name,
          },
        },
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: data,
      });

      if (error) throw error;

      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          ...data,
        };
        setCurrentUser(updatedUser);
        
        // Update userProfile as well
        if (userProfile) {
          const updatedProfile: UserProfile = {
            ...userProfile,
            displayName: data.displayName || userProfile.displayName,
            avatarUrl: data.photoURL || userProfile.avatarUrl,
          };
          setUserProfile(updatedProfile);
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };
  
  // Additional methods for compatibility with other authentication systems
  const loginWithGoogleProvider = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };
  
  const loginWithFacebookProvider = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      throw error;
    }
  };

  // Provide method aliases for compatibility
  const login = signIn;
  const register = signUp;
  const logout = signOut;
  const forgotPassword = resetPassword;
  const updateUserProfile = updateProfile;

  const value = {
    currentUser,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile,
    loginWithGoogleProvider,
    loginWithFacebookProvider,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
