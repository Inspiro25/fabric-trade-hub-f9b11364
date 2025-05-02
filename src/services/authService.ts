
// Only fixing the issue with displayName vs display_name
import { ExtendedUser, UserPreferences } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { formatPreferences } from '@/utils/dataHelpers';

// Fetch user profile from Supabase
export const fetchUserProfile = async (userId: string): Promise<ExtendedUser | null> => {
  try {
    if (!userId) return null;
    
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select(`
        id,
        display_name,
        email,
        phone,
        address,
        preferences,
        avatar_url
      `)
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile from Supabase:', error);
      return null;
    }
    
    if (userProfile) {
      // Convert Supabase format to our UserProfile format
      return {
        id: userProfile.id,
        displayName: userProfile.display_name || 'Guest User',
        email: userProfile.email,
        phone: userProfile.phone || undefined,
        address: userProfile.address || undefined,
        preferences: formatPreferences(userProfile.preferences),
        avatarUrl: userProfile.avatar_url || undefined,
        app_metadata: {},
        user_metadata: {
          full_name: userProfile.display_name,
          phone: userProfile.phone,
          address: userProfile.address,
          avatar_url: userProfile.avatar_url
        },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      };
    }
    
    // Fetch saved addresses
    const { data: addresses } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    
    if (addresses && addresses.length > 0) {
      const formattedProfile: ExtendedUser = {
        id: userId,
        displayName: userProfile?.display_name || 'Guest User',
        email: userProfile?.email || '',
        phone: userProfile?.phone || undefined,
        address: userProfile?.address || undefined,
        preferences: formatPreferences(userProfile?.preferences),
        avatarUrl: userProfile?.avatar_url || undefined,
        savedAddresses: addresses.map(addr => ({
          id: addr.id,
          name: addr.name,
          addressLine1: addr.address_line1,
          addressLine2: addr.address_line2,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postal_code,
          country: addr.country,
          isDefault: addr.is_default
        })),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      };
      return formattedProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string, 
  userProfile: ExtendedUser | null, 
  data: Partial<ExtendedUser>
): Promise<ExtendedUser | null> => {
  try {
    if (!userId) {
      console.error('No user ID provided for profile update');
      return null;
    }

    // Convert our UserProfile format to Supabase format
    const supabaseData: any = {};
    
    if (data.displayName !== undefined) {
      supabaseData.display_name = data.displayName;
    }
    
    if (data.email !== undefined) {
      supabaseData.email = data.email;
    }
    
    if (data.phone !== undefined) {
      supabaseData.phone = data.phone;
    }
    
    if (data.address !== undefined) {
      supabaseData.address = data.address;
    }
    
    if (data.preferences !== undefined) {
      supabaseData.preferences = data.preferences;
    }
    
    if (data.avatarUrl !== undefined) {
      supabaseData.avatar_url = data.avatarUrl;
    }

    // Update user profile in Supabase
    const { error } = await supabase
      .from('user_profiles')
      .update(supabaseData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    // Fetch updated profile
    return await fetchUserProfile(userId);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};

export const addAddress = async (
  userId: string,
  address: Omit<ExtendedUser['savedAddresses'][0], 'id'>
): Promise<string | undefined> => {
  try {
    if (!userId) {
      console.error('No user ID provided for adding address');
      return undefined;
    }

    // Convert our address format to Supabase format
    const supabaseAddress = {
      user_id: userId,
      name: address.name,
      address_line1: address.addressLine1,
      address_line2: address.addressLine2,
      city: address.city,
      state: address.state,
      postal_code: address.postalCode,
      country: address.country,
      is_default: address.isDefault
    };

    // If this is the first address or is_default is true, we need to handle default address
    if (address.isDefault) {
      // First, set all existing addresses to not default
      const { error: updateError } = await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating existing addresses:', updateError);
      }
    }

    // Insert new address
    const { data, error } = await supabase
      .from('user_addresses')
      .insert(supabaseAddress)
      .select('id')
      .single();

    if (error) {
      console.error('Error adding address:', error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('Error adding address:', error);
    return undefined;
  }
};

export const updateAddress = async (
  userId: string,
  address: ExtendedUser['savedAddresses'][0]
): Promise<void> => {
  try {
    if (!userId) {
      console.error('No user ID provided for updating address');
      return;
    }

    // Convert our address format to Supabase format
    const supabaseAddress = {
      name: address.name,
      address_line1: address.addressLine1,
      address_line2: address.addressLine2,
      city: address.city,
      state: address.state,
      postal_code: address.postalCode,
      country: address.country,
      is_default: address.isDefault
    };

    // If this address is being set as default, update all other addresses
    if (address.isDefault) {
      const { error: updateError } = await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
        .neq('id', address.id);

      if (updateError) {
        console.error('Error updating other addresses:', updateError);
      }
    }

    // Update address
    const { error } = await supabase
      .from('user_addresses')
      .update(supabaseAddress)
      .eq('id', address.id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

export const removeAddress = async (
  userId: string,
  addressId: string
): Promise<void> => {
  try {
    if (!userId) {
      console.error('No user ID provided for removing address');
      return;
    }

    // Check if this is the default address
    const { data: address, error: fetchError } = await supabase
      .from('user_addresses')
      .select('is_default')
      .eq('id', addressId)
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching address:', fetchError);
      throw fetchError;
    }

    // Delete the address
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing address:', error);
      throw error;
    }

    // If this was the default address, set another address as default
    if (address.is_default) {
      const { data: addresses, error: listError } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (listError) {
        console.error('Error listing addresses:', listError);
        return;
      }

      if (addresses && addresses.length > 0) {
        const { error: updateError } = await supabase
          .from('user_addresses')
          .update({ is_default: true })
          .eq('id', addresses[0].id)
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error setting new default address:', updateError);
        }
      }
    }
  } catch (error) {
    console.error('Error removing address:', error);
    throw error;
  }
};

export const setDefaultAddress = async (
  userId: string,
  addressId: string
): Promise<void> => {
  try {
    if (!userId) {
      console.error('No user ID provided for setting default address');
      return;
    }

    // First, set all addresses to not default
    const { error: updateError } = await supabase
      .from('user_addresses')
      .update({ is_default: false })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating addresses:', updateError);
      throw updateError;
    }

    // Then, set the specified address as default
    const { error } = await supabase
      .from('user_addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};

export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }

    return data.user;
  } catch (error) {
    console.error('Error in loginWithEmailPassword:', error);
    throw error;
  }
};

export const registerWithEmailPassword = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }

    if (!data.user) {
      throw new Error('No user returned from signup');
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        display_name: data.user.email?.split('@')[0] || 'Guest User',
        preferences: {}
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Don't throw here, we still want to return the user
    }

    // Fetch the created profile
    const profile = await fetchUserProfile(data.user.id);

    return {
      user: data.user,
      profile
    };
  } catch (error) {
    console.error('Error in registerWithEmailPassword:', error);
    throw error;
  }
};

export const loginWithGoogleAuth = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }

    // For OAuth, we need to wait for the redirect and then get the user
    // This will be handled by the auth state change listener
    return {
      user: null,
      profile: null
    };
  } catch (error) {
    console.error('Error in loginWithGoogleAuth:', error);
    throw error;
  }
};

export const loginWithFacebookAuth = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('Error signing in with Facebook:', error);
      throw error;
    }

    // For OAuth, we need to wait for the redirect and then get the user
    // This will be handled by the auth state change listener
    return {
      user: null,
      profile: null
    };
  } catch (error) {
    console.error('Error in loginWithFacebookAuth:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in logout:', error);
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    throw error;
  }
};
