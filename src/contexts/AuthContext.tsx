
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, UserProfile, AuthContextType } from '@/types/user';

// Create context with an initial empty state
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  updateUserProfile: async () => {}, // Add this line
  deleteAccount: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  loginWithGoogleProvider: async () => {}, // Add Google provider
  loginWithFacebookProvider: async () => {} // Add Facebook provider
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setCurrentUser({
            ...session.user,
            displayName: session.user.user_metadata?.full_name || '',
            photoURL: session.user.user_metadata?.avatar_url || '',
            uid: session.user.id
          });
          await fetchUserProfile(session.user.id);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setCurrentUser({
          ...session.user,
          displayName: session.user.user_metadata?.full_name || '',
          photoURL: session.user.user_metadata?.avatar_url || '',
          uid: session.user.id
        });
        await fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUserProfile({
          ...data,
          displayName: data.display_name,
          avatarUrl: data.avatar_url
        });
      } else {
        // Create a profile if it doesn't exist
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const newProfile = {
            id: userData.user.id,
            display_name: userData.user.user_metadata?.full_name || '',
            avatar_url: userData.user.user_metadata?.avatar_url || '',
            email: userData.user.email,
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert([newProfile])
            .select()
            .single();

          if (createError) {
            console.error('Error creating user profile:', createError);
            return;
          }

          if (createdProfile) {
            setUserProfile({
              ...createdProfile,
              displayName: createdProfile.display_name,
              avatarUrl: createdProfile.avatar_url
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Auth functions
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    return login(email, password);
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    return logout();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      setLoading(true);
      const updates = {
        ...data,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', currentUser.id);
        
      if (error) throw error;
      
      // Update the local user profile state
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      
      // If name was updated, update auth metadata as well
      if (data.display_name) {
        await supabase.auth.updateUser({
          data: { full_name: data.display_name }
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Alias for updateProfile to maintain compatibility
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    return updateProfile(data);
  };

  const deleteAccount = async () => {
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      setLoading(true);
      
      // Delete user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', currentUser.id);
        
      if (profileError) throw profileError;
      
      // Delete user authentication data
      // Note: We can't directly delete the user from the auth schema,
      // as this requires admin privileges. Instead, we should use a server function or admin API
      // This is a limitation in the current implementation
      const { error: authError } = await supabase.auth.admin.deleteUser(currentUser.id);
      
      if (authError) throw authError;
      
      // Sign out the user
      await logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Social login methods
  const loginWithGoogleProvider = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const loginWithFacebookProvider = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with Facebook:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    signIn,
    register,
    logout,
    signOut,
    resetPassword,
    updateProfile,
    updateUserProfile,
    deleteAccount,
    loginWithGoogleProvider,
    loginWithFacebookProvider
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
