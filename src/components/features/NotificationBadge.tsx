
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import SettingsMenu from './SettingsMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge = ({ className = "" }: NotificationBadgeProps) => {
  const { unreadCount, markAllAsRead } = useNotifications();
  const { currentUser } = useAuth();
  
  return (
    <div className="flex items-center gap-3">
      <Link 
        to="/notifications" 
        className={`relative text-gray-700 hover:text-gray-900 transition-colors ${className}`}
        aria-label="View notifications"
      >
        <Bell size={18} />
        <AnimatePresence>
          {currentUser && unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
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
      </Link>
      <SettingsMenu />
    </div>
  );
};

export default NotificationBadge;
