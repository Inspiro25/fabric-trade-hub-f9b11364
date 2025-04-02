import { User, UserCredential } from 'firebase/auth';
import { db, doc, setDoc, getDoc, loginWithEmail, loginWithGoogle, loginWithFacebook, registerWithEmail, logoutUser, resetPassword } from '@/lib/firebase';
import { UserProfile } from '@/types/auth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatPreferences } from '@/utils/dataHelpers';
import { User } from '@/types/user';
import { UserProfile } from '@/types/profile';
import { AuthError } from '@supabase/supabase-js';
import { PhoneAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { firebaseUIDToUUID } from '@/utils/format';

// Fetch user profile from Supabase
export const fetchUserProfile = async (uid: string, currentUser: User | null): Promise<UserProfile | null> => {
  try {
    if (!uid) return null;
    
    const supabaseUUID = firebaseUIDToUUID(uid);
    
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select(`
        display_name,
        email,
        phone,
        address,
        preferences,
        avatar_url
      `)
      .eq('id', supabaseUUID)
      .single();
    
    if (error) {
      console.error('Error fetching profile from Supabase:', error);
      
      // Fallback to Firebase if Supabase fails
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      } else if (currentUser) {
        // If no profile exists in Firebase either, create one with basic info
        // Try to use the photoURL from the auth provider if available
        const newProfile: UserProfile = {
          displayName: currentUser.displayName || 'Guest User',
          email: currentUser.email || '',
          avatarUrl: currentUser.photoURL || undefined
        };
        
        // Save to Firebase as fallback
        await setDoc(doc(db, 'users', uid), newProfile);
        return newProfile;
      }
    } else if (userProfile) {
      // Convert Supabase format to our UserProfile format
      return {
        displayName: userProfile.display_name || 'Guest User',
        email: userProfile.email,
        phone: userProfile.phone || undefined,
        address: userProfile.address || undefined,
        preferences: formatPreferences(userProfile.preferences),
        avatarUrl: userProfile.avatar_url || undefined
      };
    }
    
    // Fetch saved addresses
    const { data: addresses } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', uid)
      .order('is_default', { ascending: false });
    
    if (addresses && addresses.length > 0) {
      const formattedProfile = {
        displayName: userProfile?.display_name || 'Guest User',
        email: userProfile?.email || (currentUser?.email || ''),
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
        }))
      };
      return formattedProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Update user profile in Supabase
export const updateUserProfile = async (
  currentUser: User | null, 
  userProfile: UserProfile | null, 
  data: Partial<UserProfile>
): Promise<UserProfile | null> => {
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  try {
    // Prepare data for Supabase format
    const supabaseData = {
      display_name: data.displayName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      preferences: data.preferences ? JSON.stringify(data.preferences) : undefined,
      avatar_url: data.avatarUrl
    };
    
    // Filter out undefined values
    const filteredData = Object.entries(supabaseData)
      .filter(([_, v]) => v !== undefined)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    
    // Update in Supabase
    const { error } = await supabase
      .from('user_profiles')
      .update(filteredData)
      .eq('id', currentUser.uid);
    
    if (error) {
      console.error('Error updating profile in Supabase:', error);
      
      // Fallback to Firebase if Supabase fails
      const updatedProfile = {
        ...userProfile,
        ...data
      };
      
      await setDoc(doc(db, 'users', currentUser.uid), updatedProfile, { merge: true });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
      
      return updatedProfile;
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
    
    return {
      ...userProfile,
      ...data
    };
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

// Add a new address
export const addAddress = async (
  currentUser: User | null,
  address: Omit<UserProfile['savedAddresses'][0], 'id'>
): Promise<string | undefined> => {
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  try {
    // Prepare data for Supabase format
    const supabaseData = {
      user_id: currentUser.uid,
      name: address.name,
      address_line1: address.addressLine1,
      address_line2: address.addressLine2,
      city: address.city,
      state: address.state,
      postal_code: address.postalCode,
      country: address.country,
      is_default: address.isDefault
    };
    
    // If this is default, update all other addresses to non-default
    if (address.isDefault) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', currentUser.uid);
    }
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('user_addresses')
      .insert(supabaseData)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding address in Supabase:', error);
      toast({
        title: "Failed to Add Address",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    toast({
      title: "Address Added",
      description: "Your address has been successfully added",
    });
    
    return data.id;
  } catch (error) {
    console.error('Error adding address:', error);
    toast({
      title: "Failed to Add Address",
      description: error instanceof Error ? error.message : "Failed to add address",
      variant: "destructive",
    });
    throw error;
  }
};

// Update an existing address
export const updateAddress = async (
  currentUser: User | null,
  address: UserProfile['savedAddresses'][0]
): Promise<void> => {
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  try {
    // Prepare data for Supabase format
    const supabaseData = {
      name: address.name,
      address_line1: address.addressLine1,
      address_line2: address.addressLine2,
      city: address.city,
      state: address.state,
      postal_code: address.postalCode,
      country: address.country,
      is_default: address.isDefault
    };
    
    // If this is default, update all other addresses to non-default
    if (address.isDefault) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', currentUser.uid)
        .neq('id', address.id);
    }
    
    // Update in Supabase
    const { error } = await supabase
      .from('user_addresses')
      .update(supabaseData)
      .eq('id', address.id)
      .eq('user_id', currentUser.uid);
    
    if (error) {
      console.error('Error updating address in Supabase:', error);
      toast({
        title: "Failed to Update Address",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    toast({
      title: "Address Updated",
      description: "Your address has been successfully updated",
    });
  } catch (error) {
    console.error('Error updating address:', error);
    toast({
      title: "Failed to Update Address",
      description: error instanceof Error ? error.message : "Failed to update address",
      variant: "destructive",
    });
    throw error;
  }
};

// Remove an address
export const removeAddress = async (
  currentUser: User | null,
  addressId: string
): Promise<void> => {
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  try {
    // Delete from Supabase
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', currentUser.uid);
    
    if (error) {
      console.error('Error removing address in Supabase:', error);
      toast({
        title: "Failed to Remove Address",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    toast({
      title: "Address Removed",
      description: "Your address has been successfully removed",
    });
  } catch (error) {
    console.error('Error removing address:', error);
    toast({
      title: "Failed to Remove Address",
      description: error instanceof Error ? error.message : "Failed to remove address",
      variant: "destructive",
    });
    throw error;
  }
};

// Set an address as default
export const setDefaultAddress = async (
  currentUser: User | null,
  addressId: string
): Promise<void> => {
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  try {
    // First set all addresses to non-default
    await supabase
      .from('user_addresses')
      .update({ is_default: false })
      .eq('user_id', currentUser.uid);
    
    // Then set the specified address as default
    const { error } = await supabase
      .from('user_addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', currentUser.uid);
    
    if (error) {
      console.error('Error setting default address in Supabase:', error);
      toast({
        title: "Failed to Set Default Address",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    
    toast({
      title: "Default Address Updated",
      description: "Your default address has been successfully updated",
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    toast({
      title: "Failed to Set Default Address",
      description: error instanceof Error ? error.message : "Failed to set default address",
      variant: "destructive",
    });
    throw error;
  }
};

// Login with email and password
export const loginWithEmailPassword = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await loginWithEmail(email, password);
    
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    });
    
    return userCredential;
  } catch (error) {
    console.error(error);
    toast({
      title: "Login Failed",
      description: error instanceof Error ? error.message : "Failed to login",
      variant: "destructive",
    });
    throw error;
  }
};

// Register with email and password
export const registerWithEmailPassword = async (email: string, password: string): Promise<{userCredential: User, profile: UserProfile}> => {
  try {
    const userCredential = await registerWithEmail(email, password);
    
    // Create user profile in Supabase
    // Note: We don't need to explicitly create a profile because the trigger in Supabase
    // will automatically create one. We just need to format the data for our app.
    
    const newUser: UserProfile = {
      displayName: email.split('@')[0],
      email: email,
    };
    
    toast({
      title: "Registration Successful",
      description: "Your account has been created",
    });
    
    return { userCredential, profile: newUser };
  } catch (error) {
    console.error(error);
    toast({
      title: "Registration Failed",
      description: error instanceof Error ? error.message : "Failed to register",
      variant: "destructive",
    });
    throw error;
  }
};

// Login with Google
export const loginWithGoogleAuth = async (): Promise<{userCredential: User, profile: UserProfile | null}> => {
  try {
    console.log("Attempting Google login");
    const userCredential = await loginWithGoogle();
    
    // Check if user profile exists
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userCredential.uid)
      .single();
    
    let profile: UserProfile | null = null;
    
    if (error || !userProfile) {
      console.log('User profile not found or error:', error);
      // Get the photo URL from Google authentication if available
      const photoURL = userCredential.photoURL;
      
      // Create a new profile with the photo URL
      profile = {
        displayName: userCredential.displayName || 'Google User',
        email: userCredential.email || '',
        avatarUrl: photoURL || undefined
      };
      
      // Try to update the profile with the avatar URL
      try {
        await supabase
          .from('user_profiles')
          .upsert({
            id: userCredential.uid,
            display_name: profile.displayName,
            email: profile.email,
            avatar_url: profile.avatarUrl
          });
      } catch (upsertError) {
        console.error('Error upserting profile with avatar:', upsertError);
      }
    } else {
      profile = {
        displayName: userProfile.display_name || userCredential.displayName || 'Google User',
        email: userProfile.email || userCredential.email || '',
        phone: userProfile.phone || undefined,
        address: userProfile.address || undefined,
        avatarUrl: userProfile.avatar_url || userCredential.photoURL || undefined,
      };
      
      // Update the avatar URL if it's not set but available from auth
      if (!userProfile.avatar_url && userCredential.photoURL) {
        try {
          await supabase
            .from('user_profiles')
            .update({ avatar_url: userCredential.photoURL })
            .eq('id', userCredential.uid);
            
          profile.avatarUrl = userCredential.photoURL;
        } catch (updateError) {
          console.error('Error updating avatar URL:', updateError);
        }
      }
    }
    
    toast({
      title: "Login Successful",
      description: "Welcome!",
    });
    
    return { userCredential, profile };
  } catch (error) {
    console.error(error);
    toast({
      title: "Google Login Failed",
      description: error instanceof Error ? error.message : "Failed to login with Google",
      variant: "destructive",
    });
    throw error;
  }
};

// Login with Facebook
export const loginWithFacebookAuth = async (): Promise<{userCredential: User, profile: UserProfile | null}> => {
  try {
    console.log("Attempting Facebook login");
    const userCredential = await loginWithFacebook();
    
    // Check if user profile exists
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userCredential.uid)
      .single();
    
    let profile: UserProfile | null = null;
    
    if (error || !userProfile) {
      console.log('User profile not found or error:', error);
      // Get the photo URL from Facebook authentication if available
      const photoURL = userCredential.photoURL;
      
      // Create a new profile with the photo URL
      profile = {
        displayName: userCredential.displayName || 'Facebook User',
        email: userCredential.email || '',
        avatarUrl: photoURL || undefined
      };
      
      // Try to update the profile with the avatar URL
      try {
        await supabase
          .from('user_profiles')
          .upsert({
            id: userCredential.uid,
            display_name: profile.displayName,
            email: profile.email,
            avatar_url: profile.avatarUrl
          });
      } catch (upsertError) {
        console.error('Error upserting profile with avatar:', upsertError);
      }
    } else {
      profile = {
        displayName: userProfile.display_name || userCredential.displayName || 'Facebook User',
        email: userProfile.email || userCredential.email || '',
        phone: userProfile.phone || undefined,
        address: userProfile.address || undefined,
        avatarUrl: userProfile.avatar_url || userCredential.photoURL || undefined,
      };
      
      // Update the avatar URL if it's not set but available from auth
      if (!userProfile.avatar_url && userCredential.photoURL) {
        try {
          await supabase
            .from('user_profiles')
            .update({ avatar_url: userCredential.photoURL })
            .eq('id', userCredential.uid);
            
          profile.avatarUrl = userCredential.photoURL;
        } catch (updateError) {
          console.error('Error updating avatar URL:', updateError);
        }
      }
    }
    
    toast({
      title: "Login Successful",
      description: "Welcome!",
    });
    
    return { userCredential, profile };
  } catch (error) {
    console.error(error);
    toast({
      title: "Facebook Login Failed",
      description: error instanceof Error ? error.message : "Failed to login with Facebook",
      variant: "destructive",
    });
    throw error;
  }
};

// Logout user
export const logout = async (): Promise<void> => {
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

// Forgot password
export const forgotPassword = async (email: string): Promise<void> => {
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


export const initializePhoneAuth = () => {
  try {
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
    });
    return recaptchaVerifier;
  } catch (error) {
    console.error('Error initializing phone auth:', error);
    throw error;
  }
};

export const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Error signing in with phone:', error);
    throw error;
  }
};

export const verifyPhoneCode = async (code: string) => {
  try {
    const result = await window.confirmationResult.confirm(code);
    return result.user;
  } catch (error) {
    console.error('Code verification error:', error);
    throw error;
  }
};
