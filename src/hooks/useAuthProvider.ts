import { useState, useEffect, useCallback } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ExtendedUser, UserPreferences } from '@/types/auth';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

// Define user type if not using next.js auth helpers
type User = {
  id: string;
  email: string;
};

export function useAuthProvider() {
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<ExtendedUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY) as SupabaseClient;

  const fetchUserProfile = async (userId: string) => {
    try {
      // Get user profile from database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const userProfile: ExtendedUser = {
          id: data.id,
          displayName: data.display_name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          preferences: data.preferences || {},
          avatarUrl: data.avatar_url || '',
          email_confirmed_at: data.email_confirmed_at,
          // Add base User properties
          app_metadata: {},
          user_metadata: {}
        };
        
        return userProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const handleSignIn = async (type: "email" | "google" | "github", email?: string, password?: string) => {
    setIsLoading(true);
    try {
      let res;
      if (type === "email") {
        res = await supabase.auth.signInWithPassword({
          email: email!,
          password: password!,
        });
      } else if (type === "google") {
        res = await supabase.auth.signInWithOAuth({
          provider: 'google',
        });
      } else if (type === "github") {
        res = await supabase.auth.signInWithOAuth({
          provider: 'github',
        });
      }

      if (res?.error) {
        throw res.error;
      }
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await supabase.auth.signUp({
        email: email!,
        password: password!,
        options: {
          data: {
            display_name: email,
          },
        },
      });

      if (res?.error) {
        throw res.error;
      }
			
			navigate('/auth/verify-otp');
      toast({
        title: "Sign Up Successful",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const res = await supabase.auth.signOut();

      if (res?.error) {
        throw res.error;
      }

      setUserProfile(null);
      toast({
        title: "Sign Out Successful",
      });
    } catch (error: any) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (profileData: Partial<ExtendedUser>) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;

      setUserProfile((prevProfile) => {
        return { ...prevProfile, ...profileData } as ExtendedUser;
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Profile Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (res?.error) {
        throw res.error;
      }

      toast({
        title: "Reset Password Email Sent",
        description: "Please check your email to reset your password.",
      });
    } catch (error: any) {
      toast({
        title: "Reset Password Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (password: string) => {
    setIsLoading(true);
    try {
      const res = await supabase.auth.updateUser({ password: password });

      if (res?.error) {
        throw res.error;
      }

      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Password Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, token: string, type: 'email') => {
		setIsLoading(true);
		try {
			const { data, error } = await supabase.auth.verifyOtp({
				email,
				token,
				type,
			})

			if (error) {
				throw error;
			}

			toast({
				title: "Email Verified",
				description: "Your email has been verified successfully.",
			});
			navigate('/');
		} catch (error: any) {
			toast({
				title: "Email Verification Failed",
				description: error.message,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchUserProfile(user.id)
        .then(profile => {
          setUserProfile(profile);
        })
        .catch(error => {
          console.error("Error fetching user profile:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setUserProfile(null);
    }
  }, [user]);

  return {
    user,
    userProfile,
    isLoading,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    handleUpdateProfile,
    handleResetPassword,
    handleUpdatePassword,
    verifyOTP,
    fetchUserProfile,
  };
}
