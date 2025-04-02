
// Define User types
export interface User {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
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
  deleteAccount: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
  isLoading: boolean;
  markNotificationAsRead: (id: string) => void;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  created_at: string;
  createdAt: string;
}
