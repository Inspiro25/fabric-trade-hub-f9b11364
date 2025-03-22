
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
  
  return (
    <div className="flex items-center gap-3">
      <Link 
        to="/notifications" 
        className={`relative text-gray-700 hover:text-gray-900 transition-colors ${className}`}
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
      </Link>
      <SettingsMenu />
    </div>
  );
};

export default NotificationBadge;
