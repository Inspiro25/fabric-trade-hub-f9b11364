import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Trash2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const groupedNotifications = {
    today: notifications.filter((n) => {
      const date = new Date(n.timestamp);
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }),
    yesterday: notifications.filter((n) => {
      const date = new Date(n.timestamp);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
      );
    }),
    older: notifications.filter((n) => {
      const date = new Date(n.timestamp);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      return date < twoDaysAgo;
    }),
  };

  const handleDeleteNotification = (id) => {
    markAsRead(id);
    toast.success('Notification deleted');
  };

  const handleClearAll = () => {
    markAllAsRead();
    toast.success('All notifications cleared');
  };

  return (
    <div className={cn(
      "container mx-auto max-w-4xl py-8 px-4",
      isDarkMode ? "text-gray-100" : "text-gray-900"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn("mr-2", isDarkMode && "text-gray-300 hover:text-white")}
          >
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearAll}
          className={cn(isDarkMode && "border-gray-700 hover:bg-gray-800")}
        >
          Mark all as read
        </Button>
      </div>
      
      <div className="space-y-6">
        {notifications.length === 0 ? (
          <Card className={cn(
            "flex flex-col items-center justify-center py-16",
            isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200"
          )}>
            <Bell className={cn(
              "w-12 h-12 mb-4",
              isDarkMode ? "text-gray-500" : "text-gray-400"
            )} />
            <h3 className="text-lg font-medium mb-1">No notifications</h3>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              You don't have any notifications at the moment
            </p>
          </Card>
        ) : (
          <>
            {groupedNotifications.today.length > 0 && (
              <div>
                <h2 className={cn(
                  "text-sm font-medium mb-3",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>Today</h2>
                <div className="space-y-3">
                  {groupedNotifications.today.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={handleDeleteNotification}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {groupedNotifications.yesterday.length > 0 && (
              <div>
                <h2 className={cn(
                  "text-sm font-medium mb-3",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>Yesterday</h2>
                <div className="space-y-3">
                  {groupedNotifications.yesterday.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={handleDeleteNotification}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {groupedNotifications.older.length > 0 && (
              <div>
                <h2 className={cn(
                  "text-sm font-medium mb-3", 
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>Earlier</h2>
                <div className="space-y-3">
                  {groupedNotifications.older.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={handleDeleteNotification}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete, isDarkMode }) => {
  const timeAgo = formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true });
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'promotion':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card className={cn(
      "p-4 relative",
      notification.read 
        ? (isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white") 
        : (isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-100"),
      isDarkMode ? "border-gray-800" : "border-gray-200"
    )}>
      {!notification.read && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500" />
      )}
      
      <div className="flex">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center mr-3", 
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        )}>
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1">
          <p className={cn(
            "text-sm mb-1",
            notification.read 
              ? (isDarkMode ? "text-gray-300" : "text-gray-600")
              : (isDarkMode ? "text-white font-medium" : "text-gray-900 font-medium")
          )}>
            {notification.message}
          </p>
          
          <p className={cn(
            "text-xs",
            isDarkMode ? "text-gray-500" : "text-gray-400" 
          )}>
            {timeAgo}
          </p>
        </div>
      </div>
      
      <div className="flex mt-3 border-t pt-2 gap-2">
        {!notification.read && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onMarkAsRead(notification.id)}
            className={cn(
              "text-xs flex items-center",
              isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <Check className="h-4 w-4 mr-1" />
            Mark as read
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "text-xs flex items-center",
            isDarkMode ? "text-red-400 hover:text-red-300 hover:bg-gray-800" : "text-red-500 hover:bg-red-50"
          )}
          onClick={() => onDelete(notification.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default Notifications;
