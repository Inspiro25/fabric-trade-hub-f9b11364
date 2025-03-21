
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

// Demo notifications for testing
const demoNotifications: Omit<Notification, 'id'>[] = [
  {
    title: 'Order Confirmed',
    message: 'Your order #12345 has been confirmed and is being processed.',
    type: 'order',
    read: false,
    timestamp: Date.now() - 3600000, // 1 hour ago
    link: '/orders/12345'
  },
  {
    title: 'Summer Sale',
    message: 'Enjoy up to 50% off on our summer collection!',
    type: 'promo',
    read: false,
    timestamp: Date.now() - 86400000, // 1 day ago
    link: '/category/sale'
  },
  {
    title: 'Welcome to Kutuku',
    message: 'Thank you for joining Kutuku. Explore our collection and enjoy shopping!',
    type: 'system',
    read: true,
    timestamp: Date.now() - 259200000, // 3 days ago
  }
];

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
        // If there's an error, initialize with demo notifications
        initializeWithDemoNotifications();
      }
    } else {
      // If no notifications in localStorage, initialize with demo notifications
      initializeWithDemoNotifications();
    }
  }, []);

  // Initialize with demo notifications
  const initializeWithDemoNotifications = () => {
    const initialNotifications = demoNotifications.map(notification => ({
      ...notification,
      id: generateId()
    }));
    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => !n.read).length);
    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(initialNotifications));
  };

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
    
    // Show toast for new notification
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  // New function to broadcast a notification to all users
  const broadcastNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    // In a real app with a backend, you'd call an API to broadcast this to all users
    // For now, we'll just add it to the current user's notifications
    addNotification(notification);
    
    // Also store in localStorage as a "broadcast" notification so we can show it to other users
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
    
    toast({
      title: "Notification Broadcast",
      description: "This notification has been sent to all users",
    });
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
