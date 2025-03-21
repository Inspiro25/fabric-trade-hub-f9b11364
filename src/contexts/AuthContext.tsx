
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { db, doc, setDoc, getDoc, auth, loginWithEmail, loginWithGoogle, loginWithFacebook, registerWithEmail, logoutUser, resetPassword } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

interface UserProfile {
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
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

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogleProvider: () => Promise<void>;
  loginWithFacebookProvider: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      } else {
        // If no profile exists, create one with basic info from auth
        if (currentUser) {
          const newProfile: UserProfile = {
            displayName: currentUser.displayName || 'Guest User',
            email: currentUser.email || '',
          };
          setUserProfile(newProfile);
          
          // Save to database
          await setDoc(doc(db, 'users', uid), newProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      
      if (user) {
        fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    try {
      // Update in firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        ...userProfile,
        ...data
      }, { merge: true });
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await loginWithEmail(email, password);
      
      // Fetch user profile after login
      await fetchUserProfile(userCredential.user.uid);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Failed to login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await registerWithEmail(email, password);
      
      // Create user profile in database
      const newUser: UserProfile = {
        displayName: email.split('@')[0],
        email: email,
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      setUserProfile(newUser);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleProvider = async () => {
    try {
      setLoading(true);
      const userCredential = await loginWithGoogle();
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        const newUser: UserProfile = {
          displayName: userCredential.user.displayName || 'Google User',
          email: userCredential.user.email || '',
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        setUserProfile(newUser);
      } else {
        setUserProfile(userDoc.data() as UserProfile);
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Google Login Failed",
        description: error instanceof Error ? error.message : "Failed to login with Google",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebookProvider = async () => {
    try {
      setLoading(true);
      const userCredential = await loginWithFacebook();
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        const newUser: UserProfile = {
          displayName: userCredential.user.displayName || 'Facebook User',
          email: userCredential.user.email || '',
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        setUserProfile(newUser);
      } else {
        setUserProfile(userDoc.data() as UserProfile);
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Facebook Login Failed",
        description: error instanceof Error ? error.message : "Failed to login with Facebook",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUserProfile(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Logout Failed",
        description: error instanceof Error ? error.message : "Failed to logout",
        variant: "destructive",
      });
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await resetPassword(email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for password reset instructions",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Password Reset Failed",
        description: error instanceof Error ? error.message : "Failed to send password reset email",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    loginWithGoogleProvider,
    loginWithFacebookProvider,
    logout,
    forgotPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
