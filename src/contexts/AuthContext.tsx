
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth, loginWithEmail, loginWithGoogle, loginWithFacebook, registerWithEmail, logoutUser, resetPassword } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogleProvider: () => Promise<void>;
  loginWithFacebookProvider: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await loginWithEmail(email, password);
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
      await registerWithEmail(email, password);
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
      await loginWithGoogle();
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
      await loginWithFacebook();
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
    loading,
    login,
    register,
    loginWithGoogleProvider,
    loginWithFacebookProvider,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
