import { useState, useEffect } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/auth';
import { toast } from 'sonner';

export const useAuthProvider = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseAuthenticated, setIsSupabaseAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setCurrentUser(session?.user ?? null);
        setIsSupabaseAuthenticated(!!session);
        
        if (session?.user) {
          await ensureUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        toast.error('Error checking authentication status');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id);
      setCurrentUser(session?.user ?? null);
      setIsSupabaseAuthenticated(!!session);
      
      if (session?.user) {
        await ensureUserProfile(session.user);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const ensureUserProfile = async (user: User) => {
    try {
      if (!user?.id) {
        console.error('Invalid user object received:', user);
        return;
      }
      
      console.log('Ensuring user profile exists for:', user.id);
      
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          console.log('Creating new user profile for:', user.id);
          
          const newProfile: UserProfile = {
            id: user.id,
            display_name: user.user_metadata?.full_name || user.user_metadata?.name || 
                       (user.email ? user.email.split('@')[0] : 'User'),
            email: user.email || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            preferences: {},
            created_at: new Date().toISOString()
          };

          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert(newProfile);

          if (insertError) {
            throw insertError;
          }

          setUserProfile(newProfile);
          return;
        }
        throw fetchError;
      }

      setUserProfile(existingProfile);
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
      toast.error('Failed to set up user profile');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email_confirm_sent_at: new Date().toISOString()
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.user) {
        await ensureUserProfile(data.user);
      }
      
      return data.user;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email,public_profile'
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Facebook:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserProfile(null);
      setCurrentUser(null);
      setIsSupabaseAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error sending password reset:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (address: Omit<UserProfile['savedAddresses'][0], 'id'>) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          savedAddresses: [...(userProfile?.savedAddresses || []), { ...address, id: crypto.randomUUID() }]
        })
        .eq('id', currentUser.id);
      if (error) throw error;
      await fetchUserProfile(currentUser.id);
      toast.success('Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
      throw error;
    }
  };

  const updateAddress = async (address: UserProfile['savedAddresses'][0]) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          savedAddresses: userProfile?.savedAddresses.map(addr => 
            addr.id === address.id ? address : addr
          ) || []
        })
        .eq('id', currentUser.id);
      if (error) throw error;
      await fetchUserProfile(currentUser.id);
      toast.success('Address updated successfully');
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
      throw error;
    }
  };

  const removeAddress = async (addressId: string) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          savedAddresses: userProfile?.savedAddresses.filter(addr => addr.id !== addressId) || []
        })
        .eq('id', currentUser.id);
      if (error) throw error;
      await fetchUserProfile(currentUser.id);
      toast.success('Address removed successfully');
    } catch (error) {
      console.error('Error removing address:', error);
      toast.error('Failed to remove address');
      throw error;
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          savedAddresses: userProfile?.savedAddresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
          })) || []
        })
        .eq('id', currentUser.id);
      if (error) throw error;
      await fetchUserProfile(currentUser.id);
      toast.success('Default address updated successfully');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
      throw error;
    }
  };

  return {
    currentUser,
    userProfile,
    loading,
    isSupabaseAuthenticated,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    forgotPassword,
    updateProfile,
    fetchUserProfile,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress
  };
};
