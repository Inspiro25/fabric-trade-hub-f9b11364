
import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, Check, CheckCheck, Bell, MailOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { NotificationType } from '@/hooks/use-notifications-status';

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  const { isDarkMode } = useTheme();
  
  switch (type) {
    case 'order':
      return <Bell className={cn("h-6 w-6", isDarkMode ? "text-blue-400" : "text-blue-500")} />;
    case 'promo':
      return <MailOpen className={cn("h-6 w-6", isDarkMode ? "text-green-400" : "text-green-500")} />;
    case 'system':
      return <Clock className={cn("h-6 w-6", isDarkMode ? "text-red-400" : "text-red-500")} />;
    default:
      return <Bell className={cn("h-6 w-6", isDarkMode ? "text-gray-400" : "text-gray-500")} />;
  }
};

const EmptyNotifications = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className={cn(
        "p-4 rounded-full mb-4", 
        isDarkMode ? "bg-gray-800" : "bg-gray-100"
      )}>
        <Bell className={cn(
          "h-8 w-8", 
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )} />
      </div>
      <h3 className={cn(
        "text-lg font-medium mb-2",
        isDarkMode ? "text-gray-300" : "text-gray-800"
      )}>
        No notifications yet
      </h3>
      <p className={cn(
        "text-sm max-w-xs",
        isDarkMode ? "text-gray-400" : "text-gray-600"
      )}>
        We'll notify you when there are new messages or updates
      </p>
    </div>
  );
};

const Notifications = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteUserNotification, 
    clearNotifications 
  } = useNotifications();
  const { isDarkMode } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "Failed to mark notifications as read",
        variant: "destructive"
      });
    }
  };
  
  const handleClearAll = async () => {
    try {
      setIsDeleting(true);
      await clearNotifications();
      toast({
        title: "All notifications cleared",
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast({
        title: "Failed to clear notifications",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className={cn(
      "container max-w-2xl mx-auto py-6 px-4",
      isDarkMode ? "text-gray-200" : ""
    )}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAsRead}
                className={isDarkMode ? "border-gray-700 hover:bg-gray-800" : ""}
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearAll}
                disabled={isDeleting}
                className={cn(
                  isDarkMode ? "border-gray-700 hover:bg-gray-800" : "",
                  "text-red-500 hover:text-red-600"
                )}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            </>
          )}
        </div>
      </div>
      
      {notifications.length > 0 ? (
        <div className={cn(
          "rounded-lg overflow-hidden shadow-sm divide-y",
          isDarkMode 
            ? "bg-gray-800 divide-gray-700 border border-gray-700" 
            : "bg-white divide-gray-200 border border-gray-100"
        )}>
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={cn(
                "p-4 flex transition-colors",
                notification.read 
                  ? isDarkMode ? "bg-gray-800/70" : "bg-white" 
                  : isDarkMode ? "bg-gray-700/50" : "bg-blue-50/60"
              )}
            >
              <div className={cn(
                "flex-shrink-0 mr-4 p-2 rounded-full",
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              )}>
                <NotificationIcon type={notification.type} />
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className={cn(
                    "font-medium truncate mr-2",
                    notification.read 
                      ? isDarkMode ? "text-gray-300" : "text-gray-800"
                      : isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {notification.title}
                  </h3>
                  <span className={cn(
                    "text-xs whitespace-nowrap",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                  </span>
                </div>
                
                <p className={cn(
                  "text-sm mb-2",
                  notification.read 
                    ? isDarkMode ? "text-gray-400" : "text-gray-600"
                    : isDarkMode ? "text-gray-300" : "text-gray-700"
                )}>
                  {notification.message}
                </p>
                
                <div className="flex justify-between items-center">
                  {notification.link && (
                    <a 
                      href={notification.link} 
                      className={cn(
                        "text-xs font-medium",
                        isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                      )}
                    >
                      View details
                    </a>
                  )}
                  
                  <div className="flex gap-2 ml-auto">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAsRead(notification.id)}
                        className={cn(
                          "h-8 px-2 text-xs",
                          isDarkMode 
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-100 text-gray-600"
                        )}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark read
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteUserNotification(notification.id)}
                      className={cn(
                        "h-8 px-2 text-xs",
                        isDarkMode 
                          ? "hover:bg-gray-700 text-red-400 hover:text-red-300"
                          : "hover:bg-gray-100 text-red-500 hover:text-red-600"
                      )}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyNotifications />
      )}
    </div>
  );
};

export default Notifications;
