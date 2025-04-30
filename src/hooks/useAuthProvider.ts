import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { toast } from '@/components/ui/use-toast';

export const useAuthProvider = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseAuthenticated, setIsSupabaseAuthenticated] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      // Only synchronous state updates here
      setCurrentUser(session?.user ?? null);
      setIsSupabaseAuthenticated(!!session);
      
      // Handle user profile after auth change
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setUserProfile(null);
      }

      // Handle auth events for better UX
      if (event === 'SIGNED_IN') {
        toast({
          title: "Signed in successfully",
          variant: "default"
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out successfully",
          variant: "default"
        });
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password reset link sent",
          description: "Please check your email",
          variant: "default"
        });
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setCurrentUser(session?.user ?? null);
      setIsSupabaseAuthenticated(!!session);

      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const ensureUserProfile = async (userId: string) => {
    try {
      console.log('Ensuring profile exists for user:', userId);
      
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') { // "No rows returned" error code
          console.log('Creating new user profile for:', userId);
          
          // Get user details
          const { data: userData } = await supabase.auth.getUser();
          const user = userData?.user;
          
          if (!user) {
            throw new Error('User data not available');
          }
          
          // Create profile
          const newProfile: Partial<UserProfile> = {
            id: userId,
            display_name: user.user_metadata?.name || 
                       user.user_metadata?.full_name || 
                       user.email?.split('@')[0] || 
                       'User',
            email: user.email || '',
            preferences: {
              notifications: {
                email: true,
                sms: false,
                push: true
              },
              theme: 'system',
              currency: 'INR',
              language: 'en'
            },
            avatar_url: user.user_metadata?.avatar_url || '',
          };

          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: userId,
              display_name: newProfile.display_name,
              email: newProfile.email,
              preferences: newProfile.preferences,
              avatar_url: newProfile.avatar_url
            });

          if (insertError) {
            console.error('Error creating user profile:', insertError);
            throw insertError;
          }

          // Fetch new profile
          const { data: newProfileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

          setUserProfile(formatProfileData(newProfileData));
        } else {
          console.error('Error fetching user profile:', fetchError);
          throw fetchError;
        }
      } else if (existingProfile) {
        setUserProfile(formatProfileData(existingProfile));
      }
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
      toast({
        title: "Profile Error",
        description: "There was a problem setting up your profile. Some features might be limited.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to format profile data from Supabase
  const formatProfileData = (profile: any, addresses?: any[]): UserProfile => {
    const formattedProfile: UserProfile = {
      id: profile.id,
      display_name: profile.display_name || 'User',
      displayName: profile.display_name || 'User', // Add compatibility field
      email: profile.email || '',
      phone: profile.phone,
      address: profile.address,
      preferences: profile.preferences || {},
      avatar_url: profile.avatar_url,
      avatarUrl: profile.avatar_url, // Add compatibility field
    };

    if (addresses && addresses.length > 0) {
      formattedProfile.savedAddresses = addresses.map(addr => ({
        id: addr.id,
        name: addr.name,
        addressLine1: addr.address_line1,
        addressLine2: addr.address_line2,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postal_code,
        country: addr.country,
        isDefault: addr.is_default
      }));
    }

    return formattedProfile;
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      console.log('Login successful for:', data.user?.id);
      return data.user;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Starting registration for:', email);
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      console.log('Registration successful for:', data.user?.id);
      
      // Profile will be created by onAuthStateChange listener
      toast({
        title: "Registration Successful",
        description: "Please check your email for verification",
        variant: "default"
      });
      
      return data.user;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
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
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: "Google Login Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email,public_profile'
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Facebook login error:', error);
      toast({
        title: "Facebook Login Failed",
        description: error.message,
        variant: "destructive"
      });
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
      
      // Clear all previous state
      setCurrentUser(null);
      setUserProfile(null);
      setIsSupabaseAuthenticated(false);
      
      // Clear any admin session storage
      sessionStorage.removeItem('adminUsername');
      sessionStorage.removeItem('adminShopId');
      sessionStorage.removeItem('adminShopName');
      sessionStorage.removeItem('adminRole');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      
      if (error) throw error;
      
      toast({
        title: "Reset Email Sent",
        description: "Check your email for the password reset link",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      setLoading(true);
      
      // Convert from our app format to Supabase format
      const supabaseData: any = {};
      
      if (data.displayName !== undefined) supabaseData.display_name = data.displayName;
      if (data.email !== undefined) supabaseData.email = data.email;
      if (data.phone !== undefined) supabaseData.phone = data.phone;
      if (data.address !== undefined) supabaseData.address = data.address;
      if (data.preferences !== undefined) supabaseData.preferences = data.preferences;
      if (data.avatarUrl !== undefined) supabaseData.avatar_url = data.avatarUrl;
      
      const { error } = await supabase
        .from('user_profiles')
        .update(supabaseData)
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      // Refresh profile
      await fetchUserProfile(currentUser.id);
      
      toast({
        title: "Profile Updated",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Profile Update Failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (address: Omit<UserProfile['savedAddresses'][0], 'id'>) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      setLoading(true);
      
      // Handle default address if needed
      if (address.isDefault) {
        // First set all addresses to non-default
        const { error: updateError } = await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', currentUser.id);
          
        if (updateError) {
          console.error('Error updating existing addresses:', updateError);
        }
      }
      
      // Convert from our app format to Supabase format
      const supabaseAddress = {
        user_id: currentUser.id,
        name: address.name,
        address_line1: address.addressLine1,
        address_line2: address.addressLine2 || null,
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        country: address.country,
        is_default: address.isDefault,
        phone_number: address.phoneNumber || ''
      };
      
      const { error } = await supabase
        .from('user_addresses')
        .insert(supabaseAddress);
      
      if (error) throw error;
      
      // Refresh profile to get new address
      await fetchUserProfile(currentUser.id);
      
      toast({
        title: "Address Added",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Add address error:', error);
      toast({
        title: "Failed to Add Address",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (address: UserProfile['savedAddresses'][0]) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      setLoading(true);
      
      // Handle default address if needed
      if (address.isDefault) {
        // First set all addresses to non-default
        const { error: updateError } = await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', currentUser.id)
          .neq('id', address.id);
          
        if (updateError) {
          console.error('Error updating existing addresses:', updateError);
        }
      }
      
      // Convert from our app format to Supabase format
      const supabaseAddress = {
        name: address.name,
        address_line1: address.addressLine1,
        address_line2: address.addressLine2 || null,
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        country: address.country,
        is_default: address.isDefault,
        phone_number: address.phoneNumber || ''
      };
      
      const { error } = await supabase
        .from('user_addresses')
        .update(supabaseAddress)
        .eq('id', address.id)
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      // Refresh profile
      await fetchUserProfile(currentUser.id);
      
      toast({
        title: "Address Updated",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Update address error:', error);
      toast({
        title: "Failed to Update Address",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeAddress = async (addressId: string) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      setLoading(true);
      
      // Check if this is the default address
      const { data: address, error: fetchError } = await supabase
        .from('user_addresses')
        .select('is_default')
        .eq('id', addressId)
        .eq('user_id', currentUser.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      // Delete the address
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      // If this was the default address, set a new default
      if (address && address.is_default) {
        const { data: addresses, error: listError } = await supabase
          .from('user_addresses')
          .select('id')
          .eq('user_id', currentUser.id)
          .limit(1);
        
        if (!listError && addresses && addresses.length > 0) {
          await supabase
            .from('user_addresses')
            .update({ is_default: true })
            .eq('id', addresses[0].id)
            .eq('user_id', currentUser.id);
        }
      }
      
      // Refresh profile
      await fetchUserProfile(currentUser.id);
      
      toast({
        title: "Address Removed",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Remove address error:', error);
      toast({
        title: "Failed to Remove Address",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      setLoading(true);
      
      // First set all addresses to non-default
      const { error: updateError } = await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', currentUser.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Then set the specified address as default
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      // Refresh profile
      await fetchUserProfile(currentUser.id);
      
      toast({
        title: "Default Address Updated",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Set default address error:', error);
      toast({
        title: "Failed to Set Default Address",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
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
    removeAddress
  };
};
