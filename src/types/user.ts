
// Define User types
export interface User {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  uid?: string; // Added for compatibility with auth systems
  displayName?: string; // Added for compatibility with Firebase
  photoURL?: string; // Added for Firebase compatibility
}

export interface UserProfile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
  preferences?: Record<string, any>;
  displayName?: string; // For compatibility
  avatarUrl?: string; // For compatibility
}

export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>; // Alias for updateProfile
  deleteAccount: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  loginWithGoogleProvider?: () => Promise<any>; // Optional methods for different auth providers
  loginWithFacebookProvider?: () => Promise<any>;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
  isLoading: boolean;
  markNotificationAsRead: (id: string) => void; // Alias for markAsRead
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  created_at: string;
  createdAt: string; // Include both versions for compatibility
}
