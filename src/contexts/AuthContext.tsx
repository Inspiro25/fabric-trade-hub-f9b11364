
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  auth, 
  loginWithEmail, 
  registerWithEmail, 
  logoutUser, 
  resetPassword, 
  loginWithGoogle, 
  loginWithFacebook,
  db,
  doc,
  getDoc,
  setDoc
} from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { toast } from 'sonner';

// Define the User interface with extended properties
export interface User extends FirebaseUser {
  displayName: string | null;
  photoURL: string | null;
  uid: string;
  email: string | null;
  role?: string;
}

// Define our ExtendedUser type that will include properties from Firebase User and custom fields
export interface ExtendedUser {
  id: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  avatarUrl?: string | null;
  uid?: string;
  role?: string;
  preferences?: {
    role?: 'user' | 'shop_admin' | 'admin';
    theme?: string;
    currency?: string;
    language?: string;
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

// Define the context type
export interface AuthContextType {
  currentUser: ExtendedUser | null;
  isLoading: boolean;
  user?: ExtendedUser | null; // For backward compatibility
  loading?: boolean; // For backward compatibility
  userProfile?: ExtendedUser | null; // For backward compatibility
  signIn: (email: string, password: string) => Promise<{ user: ExtendedUser | null; error: any | null }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ user: ExtendedUser | null; error: any | null }>;
  signOut: () => Promise<void>;
  logout?: () => Promise<void>; // For backward compatibility
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updateUserProfile?: (data: Partial<ExtendedUser>) => Promise<void>;
  isSupabaseAuthenticated?: boolean; // For backward compatibility
  loginWithGoogle?: () => Promise<ExtendedUser | null>;
  loginWithFacebook?: () => Promise<ExtendedUser | null>;
  register?: (email: string, password: string) => Promise<ExtendedUser | null>;
  login?: (email: string, password: string) => Promise<ExtendedUser | null>;
  forgotPassword?: (email: string) => Promise<void>;
  updateProfile?: (data: Partial<ExtendedUser>) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the hook for using the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to convert Firebase User to our ExtendedUser
const convertToExtendedUser = (firebaseUser: FirebaseUser | null, userProfile?: any): ExtendedUser | null => {
  if (!firebaseUser) return null;
  
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: userProfile?.displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0],
    photoURL: userProfile?.photoURL || firebaseUser.photoURL,
    avatarUrl: userProfile?.avatarUrl || userProfile?.photoURL || firebaseUser.photoURL,
    role: userProfile?.role || 'user',
    preferences: {
      role: userProfile?.role || 'user',
      theme: userProfile?.preferences?.theme || 'system',
      currency: userProfile?.preferences?.currency || 'USD',
      language: userProfile?.preferences?.language || 'en',
      notifications: userProfile?.preferences?.notifications || {
        email: true,
        sms: false,
        push: true
      }
    }
  };
};

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setIsLoading(true);
        
        if (firebaseUser) {
          const userProfile = await fetchUserProfile(firebaseUser.uid);
          const extendedUser = convertToExtendedUser(firebaseUser, userProfile);
          setCurrentUser(extendedUser);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const firebaseUser = await loginWithEmail(email, password);
      const userProfile = await fetchUserProfile(firebaseUser.uid);
      const extendedUser = convertToExtendedUser(firebaseUser, userProfile);
      setCurrentUser(extendedUser);
      toast.success('Signed in successfully');
      return { user: extendedUser, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in');
      return { user: null, error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const firebaseUser = await registerWithEmail(email, password);
      
      // User profile is created in the registerWithEmail function
      const userProfile = await fetchUserProfile(firebaseUser.uid);
      const extendedUser = convertToExtendedUser(firebaseUser, userProfile);
      
      setCurrentUser(extendedUser);
      toast.success('Account created successfully');
      return { user: extendedUser, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account');
      return { user: null, error };
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Reset password
  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email);
      toast.success('Password reset email sent');
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to send reset email');
      return { error };
    }
  };

  // Update user profile
  const updateUserProfile = useCallback(async (data: Partial<ExtendedUser>) => {
    try {
      if (!currentUser) throw new Error('Not authenticated');
      
      const userRef = doc(db, 'users', currentUser.id);
      
      // Update profile in Firestore
      await setDoc(userRef, {
        displayName: data.displayName || currentUser.displayName,
        photoURL: data.photoURL || currentUser.photoURL,
        role: data.role || currentUser.role || 'user',
        preferences: {
          ...currentUser.preferences,
          ...(data.preferences || {})
        }
      }, { merge: true });
      
      // Update local state
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  }, [currentUser]);

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const firebaseUser = await loginWithGoogle();
      const userProfile = await fetchUserProfile(firebaseUser.uid);
      const extendedUser = convertToExtendedUser(firebaseUser, userProfile);
      setCurrentUser(extendedUser);
      toast.success('Signed in with Google successfully');
      return extendedUser;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to sign in with Google');
      return null;
    }
  };

  // Handle Facebook login
  const handleFacebookLogin = async () => {
    try {
      const firebaseUser = await loginWithFacebook();
      const userProfile = await fetchUserProfile(firebaseUser.uid);
      const extendedUser = convertToExtendedUser(firebaseUser, userProfile);
      setCurrentUser(extendedUser);
      toast.success('Signed in with Facebook successfully');
      return extendedUser;
    } catch (error) {
      console.error('Facebook login error:', error);
      toast.error('Failed to sign in with Facebook');
      return null;
    }
  };

  // Value object for the context provider, including backward compatibility aliases
  const value = {
    currentUser,
    isLoading,
    loading: isLoading, // For backward compatibility
    user: currentUser, // For backward compatibility
    userProfile: currentUser, // For backward compatibility
    signIn,
    signUp,
    signOut: handleSignOut,
    logout: handleSignOut, // For backward compatibility
    resetPassword: handleResetPassword,
    updateUserProfile,
    isSupabaseAuthenticated: !!currentUser, // For backward compatibility
    loginWithGoogle: handleGoogleLogin,
    loginWithFacebook: handleFacebookLogin,
    register: async (email: string, password: string) => {
      const result = await signUp(email, password);
      return result.user;
    },
    login: async (email: string, password: string) => {
      const result = await signIn(email, password);
      return result.user;
    },
    forgotPassword: async (email: string) => {
      await handleResetPassword(email);
    },
    updateProfile: updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
