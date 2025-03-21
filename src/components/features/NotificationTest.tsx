
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell } from 'lucide-react';

const NotificationTest = () => {
  const { addNotification } = useNotifications();
  const [visible, setVisible] = useState(false);

  const sendTestNotification = (type: 'order' | 'promo' | 'system' | 'general') => {
    switch (type) {
      case 'order':
        addNotification({
          title: 'New Order Placed',
          message: 'Your order #' + Math.floor(10000 + Math.random() * 90000) + ' has been placed successfully.',
          type: 'order',
          link: '/orders'
        });
        break;
      case 'promo':
        addNotification({
          title: 'Flash Sale Alert!',
          message: 'Get 30% off on all products for the next 2 hours!',
          type: 'promo',
          link: '/category/sale'
        });
        break;
      case 'system':
        addNotification({
          title: 'App Update Available',
          message: 'A new version of the app is available with exciting features.',
          type: 'system'
        });
        break;
      case 'general':
        addNotification({
          title: 'Thanks for your feedback',
          message: 'We appreciate your feedback and are continuously working to improve.',
          type: 'general'
        });
        break;
    }
  };

  if (!visible) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setVisible(true)}
        className="fixed bottom-20 right-4 z-10 bg-white shadow-md"
      >
        <Bell className="mr-2 h-4 w-4" />
        Test Notifications
      </Button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-10 p-4 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium mb-2">Send test notification:</p>
        <Button size="sm" variant="outline" onClick={() => sendTestNotification('order')}>
          Order
        </Button>
        <Button size="sm" variant="outline" onClick={() => sendTestNotification('promo')}>
          Promotion
        </Button>
        <Button size="sm" variant="outline" onClick={() => sendTestNotification('system')}>
          System
        </Button>
        <Button size="sm" variant="outline" onClick={() => sendTestNotification('general')}>
          General
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setVisible(false)}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default NotificationTest;
