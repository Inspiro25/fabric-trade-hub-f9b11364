
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  website?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export function useAuthProvider() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    checkAuthStatus();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        if (session?.user) {
          // Convert Supabase user to our User type
          const user: User = {
            uid: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.name || null,
            photoURL: session.user.user_metadata?.avatar_url || null,
            phoneNumber: session.user.phone || null,
          };
          
          setCurrentUser(user);
          await fetchUserProfile(user.uid);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Convert Supabase user to our User type
        const user: User = {
          uid: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.name || null,
          photoURL: session.user.user_metadata?.avatar_url || null,
          phoneNumber: session.user.phone || null,
        };
        
        setCurrentUser(user);
        await fetchUserProfile(user.uid);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUserProfile({
          id: data.id,
          userId: data.user_id,
          displayName: data.display_name,
          bio: data.bio,
          avatarUrl: data.avatar_url,
          location: data.location,
          website: data.website,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  const updateEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    try {
      // Update user metadata in supabase auth
      if (data.displayName) {
        await supabase.auth.updateUser({
          data: { name: data.displayName }
        });
      }

      // Update profile in database
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: currentUser.uid,
          display_name: data.displayName,
          bio: data.bio,
          avatar_url: data.avatarUrl,
          location: data.location,
          website: data.website,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...data,
        });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const loginWithGoogleProvider = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const verifyEmail = async () => {
    // This is a placeholder for verifyEmail functionality
    console.log('Email verification functionality not implemented');
  };

  // For compatibility with legacy code
  const signIn = login;
  const signUp = register;
  const signOut = logout;
  const user = currentUser;

  return {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    updateEmail,
    updateUserProfile,
    verifyEmail,
    loginWithGoogleProvider,
    // Legacy properties
    user: currentUser,
    signIn: login,
    signUp: register,
    signOut: logout,
  };
}
