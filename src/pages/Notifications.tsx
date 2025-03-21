
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Order</Badge>;
    case 'promo':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Promo</Badge>;
    case 'system':
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">System</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">General</Badge>;
  }
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  return date.toLocaleDateString();
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };
  
  return (
    <div 
      className={`px-4 py-3.5 cursor-pointer transition-colors duration-200 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {!notification.read && (
          <div className="h-2.5 w-2.5 mt-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
        )}
        {notification.read && (
          <div className="h-2.5 w-2.5 mt-1.5 flex-shrink-0"></div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getNotificationIcon(notification.type)}
            <h3 className={`text-sm font-semibold ${notification.read ? 'text-gray-800' : 'text-black'}`}>
              {notification.title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-1.5 leading-snug">{notification.message}</p>
          <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

const EmptyNotifications = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="bg-gray-100 p-5 rounded-full mb-5">
      <Bell className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
    <p className="text-sm text-gray-600 max-w-md">
      When you get notifications, they'll show up here.
    </p>
  </div>
);

const Notifications = () => {
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add page view tracking or analytics here if needed
  }, []);
  
  return (
    <div className="pb-16 bg-gray-50 min-h-screen">
      {/* Header - Apple style */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-xl font-semibold">Notifications</h1>
          </div>
          
          {notifications.length > 0 && (
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium text-blue-600 rounded-full"
                onClick={markAllAsRead}
              >
                Mark All
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full text-gray-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Notifications?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All notifications will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={clearNotifications} 
                      className="bg-red-500 hover:bg-red-600 rounded-full"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <main className="py-4 px-4">
        {notifications.length > 0 ? (
          <Card className="overflow-hidden rounded-xl shadow-sm border-gray-100 animate-fade-in">
            <div className="p-0.5">
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <NotificationItem notification={notification} />
                  {index < notifications.length - 1 && <Separator className="mx-4" />}
                </React.Fragment>
              ))}
            </div>
          </Card>
        ) : (
          <EmptyNotifications />
        )}
      </main>
    </div>
  );
};

export default Notifications;
