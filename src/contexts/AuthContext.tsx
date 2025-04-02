import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, UserProfile, AuthContextType } from '@/types/user';

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  deleteAccount: async () => {},
  signIn: async () => {},
  signOut: async () => {}
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setCurrentUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setCurrentUser(session.user);
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setUserProfile(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setCurrentUser(data.user);
      await fetchProfile(data.user.id);
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setCurrentUser(data.user);
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
    } catch (error) {
      console.error("Password reset failed:", error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: currentUser.id,
          ...data,
        });

      if (error) throw error;

      await fetchProfile(currentUser.id);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.deleteUser();

      if (error) {
        console.error("Error deleting user:", error);
        throw error;
      }

      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Account deletion failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    deleteAccount,
    signIn: login, // Alias for login
    signOut: logout // Alias for logout
  } as AuthContextType; // Type assertion to AuthContextType

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
