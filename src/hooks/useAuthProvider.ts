import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/auth';
import { toast } from 'react-hot-toast';

export const useAuthProvider = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseAuthenticated, setIsSupabaseAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setIsSupabaseAuthenticated(!!session);
      if (session?.user) {
        ensureUserProfile(session.user);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setCurrentUser(session?.user ?? null);
      setIsSupabaseAuthenticated(!!session);
      if (session?.user) {
        ensureUserProfile(session.user);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const ensureUserProfile = async (user: User) => {
    try {
      if (!user || !user.id) {
        console.error('Invalid user object received:', user);
        setLoading(false);
        return;
      }
      
      console.log('Ensuring user profile exists for:', user.id);
      
      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Handle the case where no profile exists
      if (fetchError) {
        if (fetchError.code === 'PGRST116') { // "No rows returned" error code
          console.log('No user profile found, will create one for user:', user.id);
          
          // If no profile exists, create one
          const newProfile = {
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
            console.error('Error creating user profile:', insertError);
            toast.error('Failed to create your user profile. Some features may be limited.');
            setLoading(false);
            return;
          }

          console.log('User profile created, fetching it back');
          
          // Fetch the newly created profile
          const { data: newProfileData, error: refetchError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (refetchError) {
            console.error('Error fetching new user profile:', refetchError);
            setLoading(false);
            return;
          }

          console.log('Successfully created and fetched user profile');
          setUserProfile(newProfileData);
          setLoading(false);
          return;
        } else {
          // Any other error while fetching the profile
          console.error('Error fetching user profile:', fetchError);
          toast.error('Error loading your profile');
          setLoading(false);
          return;
        }
      }

      // Profile exists, set it in state
      if (existingProfile) {
        console.log('User profile found, setting state for user:', user.id);
        setUserProfile(existingProfile);
      } else {
        console.error('No error and no profile - unexpected state');
        // This should not happen but handle it just in case
        toast.error('Error loading your profile');
      }
    } catch (error) {
      console.error('Exception in ensureUserProfile:', error);
      toast.error('Failed to set up user profile');
    } finally {
      setLoading(false);
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

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // No need to create profile here - the auth state change will trigger ensureUserProfile
      toast.success('Logged in successfully');
      return data.user;
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Failed to log in');
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      console.log('Starting registration process for:', email);
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Supabase auth signup error:', error);
        throw error;
      }
      
      console.log('Supabase signup successful, user data:', data.user);
      
      if (data.user) {
        // Create user profile immediately after registration
        try {
          console.log('Creating user profile for new user:', data.user.id);
          const newProfile = {
            id: data.user.id,
            display_name: email.split('@')[0] || 'User',
            email: email,
            preferences: {},
            created_at: new Date().toISOString()
          };

          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert(newProfile);
            
          if (profileError) {
            console.error('Error creating user profile:', profileError);
            toast.error('Account created but profile setup failed. Some features may be limited.');
          } else {
            console.log('User profile created successfully');
          }
        } catch (profileError) {
          console.error('Exception during profile creation:', profileError);
          // Don't fail the registration if profile creation fails
          toast.error('Account created but profile setup failed. Some features may be limited.');
        }
      } else {
        console.warn('User created but data.user is null or undefined');
      }
      
      toast.success('Registration successful! Please check your email to verify your account.');
      return data.user;
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Failed to register: ' + (error.message || 'Unknown error'));
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
            prompt: 'consent',
          }
        }
      });
      if (error) throw error;
      // User profile will be created after OAuth callback and auth state change
    } catch (error) {
      console.error('Error logging in with Google:', error);
      toast.error('Failed to log in with Google');
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
      // User profile will be created after OAuth callback and auth state change
    } catch (error) {
      console.error('Error logging in with Facebook:', error);
      toast.error('Failed to log in with Facebook');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      if (error) throw error;
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast.error('Failed to send password reset instructions');
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
      await fetchUserProfile(currentUser.id);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
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
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress
  };
};
