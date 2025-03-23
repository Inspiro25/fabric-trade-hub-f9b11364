import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, createNotification, deleteNotification } from '@/services/notificationService';

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
  deleteUserNotification: (id: string) => void;
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
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
      }
    });
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      if (currentUser) {
        try {
          const userNotifications = await fetchUserNotifications(currentUser.uid);
          
          const formattedNotifications: Notification[] = userNotifications.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type as 'order' | 'promo' | 'system' | 'general',
            read: n.read,
            timestamp: new Date(n.createdAt).getTime(),
            link: n.link
          }));
          
          setNotifications(formattedNotifications);
          setUnreadCount(formattedNotifications.filter(n => !n.read).length);

          if (!isInitialized) {
            const hasWelcomeNotification = formattedNotifications.some(
              n => n.type === 'system' && n.title.includes('Welcome to Vyoma')
            );
            
            if (!hasWelcomeNotification) {
              await createNotification(
                currentUser.uid,
                'Welcome to Vyoma',
                'Thank you for joining our community. Explore our curated collections and enjoy shopping!',
                'system',
                '/'
              );
              
              const updatedNotifications = await fetchUserNotifications(currentUser.uid);
              const updatedFormattedNotifications = updatedNotifications.map(n => ({
                id: n.id,
                title: n.title,
                message: n.message,
                type: n.type as 'order' | 'promo' | 'system' | 'general',
                read: n.read,
                timestamp: new Date(n.createdAt).getTime(),
                link: n.link
              }));
              
              setNotifications(updatedFormattedNotifications);
              setUnreadCount(updatedFormattedNotifications.filter(n => !n.read).length);
            }
            
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };
    
    loadNotifications();
  }, [currentUser, isInitialized]);

  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel('user_notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${currentUser.uid}`
        },
        async () => {
          const userNotifications = await fetchUserNotifications(currentUser.uid);
          const formattedNotifications = userNotifications.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type as 'order' | 'promo' | 'system' | 'general',
            read: n.read,
            timestamp: new Date(n.createdAt).getTime(),
            link: n.link
          }));
          
          setNotifications(formattedNotifications);
          setUnreadCount(formattedNotifications.filter(n => !n.read).length);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const markAsRead = async (id: string) => {
    if (!currentUser) return;
    
    try {
      const success = await markNotificationAsRead(currentUser.uid, id);
      
      if (success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === id 
              ? { ...notification, read: true } 
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;
    
    try {
      const success = await markAllNotificationsAsRead(currentUser.uid);
      
      if (success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotifications = async () => {
    if (!currentUser) return;
    
    try {
      const deletePromises = notifications.map(notification => 
        deleteNotification(currentUser.uid, notification.id)
      );
      
      await Promise.all(deletePromises);
      setNotifications([]);
      setUnreadCount(0);
      
      toast({
        title: "Notifications Cleared",
        description: "All notifications have been removed",
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear notifications",
      });
    }
  };

  const deleteUserNotification = async (id: string) => {
    if (!currentUser) return;
    
    try {
      const success = await deleteNotification(currentUser.uid, id);
      
      if (success) {
        const notificationToRemove = notifications.find(n => n.id === id);
        setNotifications(prevNotifications => 
          prevNotifications.filter(notification => notification.id !== id)
        );
        
        if (notificationToRemove && !notificationToRemove.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        toast({
          title: "Notification Removed",
          description: "The notification has been deleted",
        });
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notification",
      });
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (!currentUser) return;
    
    try {
      const success = await createNotification(
        currentUser.uid,
        notification.title,
        notification.message,
        notification.type,
        notification.link
      );
      
      if (success) {
        toast({
          title: notification.title,
          description: notification.message
        });
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
    deleteUserNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
