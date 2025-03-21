
import { User, UserCredential } from 'firebase/auth';
import { db, doc, setDoc, getDoc, loginWithEmail, loginWithGoogle, loginWithFacebook, registerWithEmail, logoutUser, resetPassword } from '@/lib/firebase';
import { UserProfile } from '@/types/auth';
import { toast } from '@/components/ui/use-toast';

// Fetch user profile from Firestore
export const fetchUserProfile = async (uid: string, currentUser: User | null): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      // If no profile exists, create one with basic info from auth
      if (currentUser) {
        const newProfile: UserProfile = {
          displayName: currentUser.displayName || 'Guest User',
          email: currentUser.email || '',
        };
        
        // Save to database
        await setDoc(doc(db, 'users', uid), newProfile);
        return newProfile;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (
  currentUser: User | null, 
  userProfile: UserProfile | null, 
  data: Partial<UserProfile>
): Promise<UserProfile | null> => {
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  try {
    // Update in firestore
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
    
    // Create user profile in database
    const newUser: UserProfile = {
      displayName: email.split('@')[0],
      email: email,
    };
    
    await setDoc(doc(db, 'users', userCredential.uid), newUser);
    
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
    const userCredential = await loginWithGoogle();
    
    // Check if user profile exists, create if not
    const userDoc = await getDoc(doc(db, 'users', userCredential.uid));
    let profile: UserProfile | null = null;
    
    if (!userDoc.exists()) {
      const newUser: UserProfile = {
        displayName: userCredential.displayName || 'Google User',
        email: userCredential.email || '',
      };
      
      await setDoc(doc(db, 'users', userCredential.uid), newUser);
      profile = newUser;
    } else {
      profile = userDoc.data() as UserProfile;
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
    const userCredential = await loginWithFacebook();
    
    // Check if user profile exists, create if not
    const userDoc = await getDoc(doc(db, 'users', userCredential.uid));
    let profile: UserProfile | null = null;
    
    if (!userDoc.exists()) {
      const newUser: UserProfile = {
        displayName: userCredential.displayName || 'Facebook User',
        email: userCredential.email || '',
      };
      
      await setDoc(doc(db, 'users', userCredential.uid), newUser);
      profile = newUser;
    } else {
      profile = userDoc.data() as UserProfile;
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
