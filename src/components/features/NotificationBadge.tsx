
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge = ({ className = "" }: NotificationBadgeProps) => {
  const { unreadCount } = useNotifications();
  
  return (
    <Link to="/notifications" className={`relative text-gray-700 ${className}`}>
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBadge;
