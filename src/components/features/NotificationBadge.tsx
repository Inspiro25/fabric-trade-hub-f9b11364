
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import SettingsMenu from './SettingsMenu';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge = ({ className = "" }: NotificationBadgeProps) => {
  const { unreadCount } = useNotifications();
  const { currentUser } = useAuth();
  
  return (
    <div className="flex items-center gap-3">
      <Link to="/notifications" className={`relative text-gray-700 ${className}`}>
        <Bell size={18} />
        {currentUser && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] min-w-[14px] h-[14px] flex items-center justify-center rounded-full font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Link>
      <SettingsMenu />
    </div>
  );
};

export default NotificationBadge;
