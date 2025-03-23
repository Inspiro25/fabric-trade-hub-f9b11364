
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Trash } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from 'sonner';

interface NotificationDropdownProps {
  children: React.ReactNode;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ children }) => {
  const { notifications, markAllAsRead, deleteUserNotification, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleClearAll = () => {
    clearNotifications();
    toast.success('All notifications cleared');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2" 
              onClick={handleMarkAllAsRead}
              disabled={notifications.length === 0}
            >
              <Check className="h-4 w-4 mr-1" />
              <span className="text-xs">Mark all read</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2" 
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              <Trash className="h-4 w-4 mr-1" />
              <span className="text-xs">Clear all</span>
            </Button>
          </div>
        </div>
        <Separator />
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-4 cursor-default ${!notification.read ? 'bg-muted/50' : ''}`}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  
                  <div className="flex justify-end gap-2 mt-2">
                    {!notification.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          deleteUserNotification(notification.id);
                          markAllAsRead();
                          toast.success('Notification marked as read');
                        }}
                      >
                        Mark as read
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        deleteUserNotification(notification.id);
                        toast.success('Notification removed');
                      }}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
