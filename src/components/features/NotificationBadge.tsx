
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
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full font-medium">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBadge;
