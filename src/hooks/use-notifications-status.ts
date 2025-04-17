
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export type NotificationType = 'order' | 'promo' | 'system' | 'general';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: number;
  link?: string;
}

export function useNotificationsStatus() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  // If auth context is not available, provide a fallback of null
  const auth = useAuth ? useAuth() : { currentUser: null };
  const { currentUser } = auth;

  // Fetch notifications from the database
  const fetchNotifications = async () => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', currentUser.uid)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      
      const formattedNotifications = data.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type as NotificationType,
        read: n.read,
        timestamp: new Date(n.created_at).getTime(),
        link: n.link
      }));
      
      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', currentUser.uid);
      
      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('user_id', currentUser.uid)
        .eq('read', false);
      
      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
      
      toast({
        title: "All notifications marked as read",
        variant: "default"
      });
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('user_notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.uid);
      
      if (error) {
        console.error('Error deleting notification:', error);
        return;
      }
      
      const deletedNotification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: "Notification deleted",
        variant: "default"
      });
    } catch (error) {
      console.error('Error in deleteNotification:', error);
    }
  };

  // Create a new notification
  const createNotification = async (notification: {
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
  }) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('user_notifications')
        .insert({
          user_id: currentUser.uid,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          link: notification.link,
          read: false
        });
      
      if (error) {
        console.error('Error creating notification:', error);
        return;
      }
      
      fetchNotifications();
      
      toast({
        title: notification.title,
        description: notification.message,
      });
    } catch (error) {
      console.error('Error in createNotification:', error);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!currentUser) return;

    fetchNotifications();

    // Set up real-time listener
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
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    fetchNotifications
  };
}
