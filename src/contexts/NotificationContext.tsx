
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system' | 'general';
  read: boolean;
  timestamp: number;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  broadcastNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error('Error parsing notifications from localStorage:', error);
        // Initialize with empty notifications instead of demo notifications
        setNotifications([]);
      }
    }
  }, []);

  // Save notifications to localStorage when changed
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: Date.now(),
      read: false,
    };
    
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    
    // Show toast for new notification - making it more subtle
    toast({
      title: notification.title,
      description: notification.message,
      duration: 3000, // Shorter duration
    });
  };

  // Function to broadcast a notification to all users
  const broadcastNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    // Add it to the current user's notifications
    addNotification(notification);
    
    // Also store in localStorage as a "broadcast" notification
    try {
      const existingBroadcasts = JSON.parse(localStorage.getItem('broadcastNotifications') || '[]');
      const newBroadcast = {
        ...notification,
        id: generateId(),
        timestamp: Date.now(),
        read: false,
      };
      existingBroadcasts.unshift(newBroadcast);
      localStorage.setItem('broadcastNotifications', JSON.stringify(existingBroadcasts.slice(0, 10))); // Keep only the last 10
    } catch (error) {
      console.error('Error storing broadcast notification:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
    broadcastNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
