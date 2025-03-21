
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Lock, Globe, Moon, CreditCard, Monitor, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

const SettingItem = ({ 
  icon, 
  title, 
  description, 
  action 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  action: React.ReactNode; 
}) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-500">{icon}</div>
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <div>{action}</div>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <div className="pb-16 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-3 py-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
      </div>
      
      {/* Settings Content */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Notifications</h2>
            
            <SettingItem
              icon={<Bell size={18} />}
              title="Push Notifications"
              description="Get notified about order updates and promotions"
              action={<Switch defaultChecked />}
            />
            
            <Separator />
            
            <SettingItem
              icon={<Bell size={18} />}
              title="Email Notifications"
              description="Receive notifications via email"
              action={<Switch defaultChecked />}
            />
          </div>
          
          <Separator />
          
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Appearance</h2>
            
            <SettingItem
              icon={<Moon size={18} />}
              title="Dark Mode"
              description="Toggle between light and dark theme"
              action={<Switch />}
            />
            
            <Separator />
            
            <SettingItem
              icon={<Globe size={18} />}
              title="Language"
              description="Change your preferred language"
              action={
                <Button variant="ghost" size="sm" className="text-xs">
                  English
                </Button>
              }
            />
          </div>
          
          <Separator />
          
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Security</h2>
            
            <SettingItem
              icon={<Lock size={18} />}
              title="Change Password"
              description="Update your account password"
              action={
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/auth')}>
                  Change
                </Button>
              }
            />
          </div>
          
          <Separator />
          
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Payment</h2>
            
            <SettingItem
              icon={<CreditCard size={18} />}
              title="Payment Methods"
              description="Manage your payment options"
              action={
                <Button variant="ghost" size="sm" className="text-xs">
                  Manage
                </Button>
              }
            />
          </div>
          
          <Separator />
          
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Account</h2>
            
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
