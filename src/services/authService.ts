import { supabase } from '@/lib/supabase';
import { ExtendedUser, Address } from '@/types/auth';

export const getUserProfile = async (userId: string) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      return null;
    }

    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .select('*')
      .eq('userId', userId);

    if (addressError) {
      console.error('Error fetching addresses:', addressError);
      return null;
    }
    
    // When processing addresses, ensure userId is included
    const addresses = addressData?.map(address => ({
      id: address.id,
      userId: userId, // Add this line to include userId
      name: address.name,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    })) as Address[];

    const userData: ExtendedUser = {
      id: user.id,
      email: user.email,
      user_metadata: {
        ...user.user_metadata,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: `${user.first_name} ${user.last_name}`,
        avatar_url: user.avatar_url,
        phone: user.phone,
        address: user.address,
      },
      app_metadata: user.app_metadata,
      phone: user.phone,
      address: user.address,
      email_confirmed_at: user.email_confirmed_at,
      displayName: user.full_name,
      photoURL: user.avatar_url,
      avatarUrl: user.avatar_url,
      uid: user.id,
      role: user.role,
      savedAddresses: addresses,
    };

    return userData;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};
