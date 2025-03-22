
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

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
  const { markAsRead, deleteUserNotification } = useNotifications();
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
    <div className="relative px-3 py-2.5 transition-colors duration-200 group">
      <div 
        className={`cursor-pointer ${notification.read ? 'bg-white' : 'bg-blue-50'} p-2 rounded-md`}
        onClick={handleClick}
      >
        <div className="flex items-start gap-2">
          {!notification.read && (
            <div className="h-2 w-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
          )}
          {notification.read && (
            <div className="h-2 w-2 mt-1.5 flex-shrink-0"></div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between gap-1.5 mb-0.5">
              <div className="flex items-center gap-1.5">
                {getNotificationIcon(notification.type)}
                <h3 className={`text-xs font-semibold ${notification.read ? 'text-gray-800' : 'text-black'}`}>
                  {notification.title}
                </h3>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {!notification.read && (
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                      toast({
                        description: "Notification marked as read"
                      });
                    }}>
                      <Check className="mr-2 h-4 w-4" />
                      <span>Mark as read</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    deleteUserNotification(notification.id);
                  }}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-xs text-gray-600 mb-1 leading-tight">{notification.message}</p>
            <span className="text-[10px] text-gray-500">{formatTimestamp(notification.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyNotifications = () => (
  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
    <div className="bg-gray-100 p-4 rounded-full mb-3">
      <Bell className="h-6 w-6 text-gray-400" />
    </div>
    <h3 className="text-base font-semibold text-gray-900 mb-1">No Notifications</h3>
    <p className="text-xs text-gray-600 max-w-xs">
      When you get notifications, they'll show up here.
    </p>
  </div>
);

const Notifications = () => {
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const navigate = useNavigate();
  
  return (
    <div className="pb-12 bg-gray-50 min-h-screen">
      {/* Header - Compact Apple style */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-3 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-lg font-semibold">Notifications</h1>
          </div>
          
          {notifications.length > 0 && (
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs font-medium text-blue-600 rounded-full px-2.5 py-1 h-7"
                onClick={markAllAsRead}
              >
                Mark All
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-full text-gray-500"
                  >
                    <Trash2 size={14} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-xl max-w-[90%] p-4">
                  <AlertDialogHeader className="pb-2">
                    <AlertDialogTitle className="text-base">Clear All Notifications?</AlertDialogTitle>
                    <AlertDialogDescription className="text-xs">
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2 pt-2">
                    <AlertDialogCancel className="rounded-full text-xs h-8">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={clearNotifications} 
                      className="bg-red-500 hover:bg-red-600 rounded-full text-xs h-8"
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
      <main className="py-2 px-2">
        {notifications.length > 0 ? (
          <Card className="overflow-hidden rounded-xl shadow-sm border-gray-100 animate-fade-in">
            <div className="p-0.5">
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <NotificationItem notification={notification} />
                  {index < notifications.length - 1 && <Separator className="mx-2" />}
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
