
import React, { useState } from 'react';
import { Bell, CheckCircle, X, Settings, ChevronRight, Package, Percent, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationItem = ({ notification, onMarkAsRead }: { 
  notification: any, 
  onMarkAsRead: (id: string) => void 
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'promo': return 'bg-green-50 border-green-200 text-green-700';
      case 'system': return 'bg-orange-50 border-orange-200 text-orange-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div 
      className={cn("p-2.5 text-left cursor-pointer transition-colors hover:bg-gray-50 rounded-md", 
        !notification.read ? "bg-blue-50/40" : ""
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-2">
        <div className={cn("rounded-full flex items-center justify-center p-1.5 flex-shrink-0", getTypeColor(notification.type))}>
          {notification.type === 'order' && <Package className="h-3.5 w-3.5" />}
          {notification.type === 'promo' && <Percent className="h-3.5 w-3.5" />}
          {notification.type === 'system' && <Bell className="h-3.5 w-3.5" />}
          {notification.type === 'general' && <Info className="h-3.5 w-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-0.5 truncate">{notification.title}</h4>
          <p className="text-xs text-gray-600 mb-1 line-clamp-2">{notification.message}</p>
          <span className="text-[10px] text-gray-500">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </span>
        </div>
        {!notification.read && (
          <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
        )}
      </div>
    </div>
  );
};

const NotificationBadge = ({ className = "" }: NotificationBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Try-catch to gracefully handle when NotificationProvider isn't available
  let notifications = [];
  let unreadCount = 0;
  let currentUser = null;
  let markAsRead = (id: string) => {};
  let markAllAsRead = () => {};
  
  try {
    const notificationContext = useNotifications();
    notifications = notificationContext?.notifications || [];
    unreadCount = notificationContext?.unreadCount || 0;
    markAsRead = notificationContext?.markAsRead || (() => {});
    markAllAsRead = notificationContext?.markAllAsRead || (() => {});
    
    const authContext = useAuth();
    currentUser = authContext?.currentUser;
  } catch (error) {
    console.warn('NotificationProvider not available');
    // Continue with default values
  }
  
  // Enhanced animation variants
  const badgeVariants = {
    initial: { 
      scale: 0.5, 
      opacity: 0 
    },
    animate: { 
      scale: [0.5, 1.2, 1], 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };
  
  const bellAnimation = {
    initial: { rotate: 0 },
    animate: unreadCount > 0 ? { 
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { 
        repeat: unreadCount > 5 ? Infinity : 1, 
        repeatDelay: 3,
        duration: 0.6 
      }
    } : {}
  };
  
  const viewAllNotifications = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  const recentNotifications = notifications.slice(0, 5);
  
  return (
    <div className="flex items-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("relative text-gray-700 hover:text-gray-900 transition-colors", className)}
            aria-label="View notifications"
          >
            <motion.div
              initial="initial"
              animate="animate"
              variants={bellAnimation}
            >
              <Bell size={18} />
            </motion.div>
            
            <AnimatePresence>
              {currentUser && unreadCount > 0 && (
                <motion.div
                  key="notification-badge"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={badgeVariants}
                  className="absolute -top-1 -right-1"
                >
                  <Badge 
                    variant="destructive" 
                    className="px-1 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-medium rounded-full"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0 mr-4" align="end">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={markAllAsRead}
              >
                <CheckCircle className="h-3 w-3 mr-1.5" />
                Mark all as read
              </Button>
            )}
          </div>
          
          <div className="overflow-y-auto max-h-[350px]">
            {recentNotifications.length > 0 ? (
              recentNotifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsRead={markAsRead} 
                />
              ))
            ) : (
              <div className="p-4 text-center">
                <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                  <Bell className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-sm text-gray-600">No notifications yet</p>
              </div>
            )}
          </div>
          
          {recentNotifications.length > 0 && (
            <div className="p-2 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-between text-sm h-9"
                onClick={viewAllNotifications}
              >
                View all notifications
                <ChevronRight className="h-4 w-4 opacity-70" />
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationBadge;
