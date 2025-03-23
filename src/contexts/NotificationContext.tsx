
import { createContext, useContext, ReactNode } from 'react';
import { useNotificationsStatus, Notification, NotificationType } from '@/hooks/use-notifications-status';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  addNotification: (notification: {
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
  }) => Promise<void>;
  deleteUserNotification: (id: string) => Promise<void>;
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
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
  } = useNotificationsStatus();

  // Wrapper for deleteNotification to match the existing API
  const deleteUserNotification = async (id: string) => {
    await deleteNotification(id);
  };

  // Wrapper for clearNotifications to match the existing API
  const clearNotifications = async () => {
    // Delete all notifications one by one
    for (const notification of notifications) {
      await deleteNotification(notification.id);
    }
  };

  // Wrapper for createNotification to match the existing API
  const addNotification = async (notification: {
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
  }) => {
    await createNotification(notification);
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
