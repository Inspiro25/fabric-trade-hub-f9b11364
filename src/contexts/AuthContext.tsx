
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the User type
export interface User {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  uid?: string;
  role?: string;
}

// Define the context type
export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  user?: User | null; // For backward compatibility
  loading?: boolean; // For backward compatibility
  userProfile?: User | null; // For backward compatibility
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: any | null }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ user: User | null; error: any | null }>;
  signOut: () => Promise<void>;
  logout?: () => Promise<void>; // For backward compatibility
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updateUserProfile?: (data: Partial<User>) => Promise<void>;
  isSupabaseAuthenticated?: boolean; // For backward compatibility
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

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) throw error;
          
          setCurrentUser({
            id: session.user.id,
            email: session.user.email,
            uid: session.user.id, // For compatibility
            displayName: profile?.display_name || session.user.email?.split('@')[0],
            photoURL: profile?.avatar_url,
            role: profile?.role || 'user'
          });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (error) throw error;
            
            setCurrentUser({
              id: session.user.id,
              email: session.user.email,
              uid: session.user.id, // For compatibility
              displayName: profile?.display_name || session.user.email?.split('@')[0],
              photoURL: profile?.avatar_url,
              role: profile?.role || 'user'
            });
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (!profileError && profile) {
          const user: User = {
            id: data.user.id,
            email: data.user.email,
            uid: data.user.id, // For compatibility
            displayName: profile.display_name || data.user.email?.split('@')[0],
            photoURL: profile.avatar_url,
            role: profile.role || 'user'
          };
          
          setCurrentUser(user);
          return { user, error: null };
        }
      }
      
      return { user: null, error: new Error('Failed to get user profile') };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create a profile for the new user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            display_name: userData?.displayName || data.user.email?.split('@')[0],
            avatar_url: userData?.photoURL || null,
            role: 'user',
            created_at: new Date().toISOString()
          });
          
        if (profileError) throw profileError;
        
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          uid: data.user.id, // For compatibility
          displayName: userData?.displayName || data.user.email?.split('@')[0],
          photoURL: userData?.photoURL || null,
          role: 'user'
        };
        
        setCurrentUser(user);
        return { user, error: null };
      }
      
      return { user: null, error: new Error('Failed to create user') };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast.success('Password reset email sent');
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Failed to send reset email');
      return { error };
    }
  };

  // Add required methods for profile updates
  const updateUserProfile = useCallback(async (data: Partial<User>) => {
    try {
      if (!currentUser) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: data.displayName,
          avatar_url: data.photoURL,
          // Add other fields as needed
        })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      // Update local state
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  }, [currentUser]);

  // Add values needed for backward compatibility
  const value = {
    currentUser,
    isLoading,
    loading: isLoading, // For backward compatibility
    user: currentUser, // For backward compatibility
    userProfile: currentUser, // For backward compatibility
    signIn,
    signUp,
    signOut,
    logout: signOut, // For backward compatibility
    resetPassword,
    updateUserProfile,
    isSupabaseAuthenticated: !!currentUser // For backward compatibility
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
