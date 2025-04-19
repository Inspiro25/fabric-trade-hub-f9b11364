import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Lock, Globe, Moon, CreditCard, Monitor, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/components/ui/use-toast';
import ProfileForm from '@/components/profile/ProfileForm';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const SettingItem = ({ 
  icon, 
  title, 
  description, 
  action,
  onClick 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  action: React.ReactNode;
  onClick?: () => void;
}) => (
  <div 
    className={cn(
      "flex items-center justify-between py-4 px-4 md:px-6",
      onClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
    )}
    onClick={onClick}
  >
    <div className="flex items-start gap-3 flex-1">
      <div className="mt-0.5 text-gray-500 dark:text-gray-400">{icon}</div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium dark:text-white truncate">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="ml-4 flex-shrink-0">{action}</div>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  // Profile form state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  
  // Notification settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  // Language state
  const [language, setLanguage] = useState('English');
  
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setEmail(userProfile.email || '');
      setPhoneNumber(userProfile.phone || '');
      setAddress(userProfile.address || '');
      
      if (userProfile.preferences?.notifications) {
        setEmailNotifications(userProfile.preferences.notifications.email);
        setPushNotifications(userProfile.preferences.notifications.push);
        setSmsNotifications(userProfile.preferences.notifications.sms);
      }
      
      if (userProfile.preferences?.language) {
        setLanguage(userProfile.preferences.language);
      }
    }
  }, [userProfile]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    
    try {
      await updateUserProfile({
        displayName,
        phone: phoneNumber,
        address,
        preferences: {
          ...(userProfile?.preferences || {}),
          notifications: {
            email: emailNotifications,
            push: pushNotifications,
            sms: smsNotifications
          },
          language
        }
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };
  
  const togglePushNotifications = async () => {
    const newValue = !pushNotifications;
    setPushNotifications(newValue);
    
    try {
      await updateUserProfile({
        preferences: {
          ...(userProfile?.preferences || {}),
          notifications: {
            email: emailNotifications,
            push: newValue,
            sms: smsNotifications
          }
        }
      });
      
      toast({
        title: `Push Notifications ${newValue ? 'Enabled' : 'Disabled'}`,
        description: `You will ${newValue ? 'now' : 'no longer'} receive push notifications.`,
      });
    } catch (error) {
      setPushNotifications(!newValue);
      toast({
        title: "Update Failed",
        description: "There was an error updating your notification settings.",
        variant: "destructive",
      });
    }
  };
  
  const toggleEmailNotifications = async () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    
    try {
      await updateUserProfile({
        preferences: {
          ...(userProfile?.preferences || {}),
          notifications: {
            email: newValue,
            push: pushNotifications,
            sms: smsNotifications
          }
        }
      });
      
      toast({
        title: `Email Notifications ${newValue ? 'Enabled' : 'Disabled'}`,
        description: `You will ${newValue ? 'now' : 'no longer'} receive email notifications.`,
      });
    } catch (error) {
      setEmailNotifications(!newValue);
      toast({
        title: "Update Failed",
        description: "There was an error updating your notification settings.",
        variant: "destructive",
      });
    }
  };

  const toggleSmsNotifications = async () => {
    const newValue = !smsNotifications;
    setSmsNotifications(newValue);
    
    try {
      await updateUserProfile({
        preferences: {
          ...(userProfile?.preferences || {}),
          notifications: {
            email: emailNotifications,
            push: pushNotifications,
            sms: newValue
          }
        }
      });
      
      toast({
        title: `SMS Notifications ${newValue ? 'Enabled' : 'Disabled'}`,
        description: `You will ${newValue ? 'now' : 'no longer'} receive SMS notifications.`,
      });
    } catch (error) {
      setSmsNotifications(!newValue);
      toast({
        title: "Update Failed",
        description: "There was an error updating your notification settings.",
        variant: "destructive",
      });
    }
  };
  
  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    
    try {
      await updateUserProfile({
        preferences: {
          ...(userProfile?.preferences || {}),
          language: newLanguage,
          notifications: {
            email: emailNotifications,
            push: pushNotifications,
            sms: smsNotifications
          }
        }
      });
      
      toast({
        title: "Language Updated",
        description: `Your language preference has been updated to ${newLanguage}.`,
      });
    } catch (error) {
      setLanguage(language);
      toast({
        title: "Update Failed",
        description: "There was an error updating your language preference.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Settings Content */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 pb-20">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800">
          <Sheet>
            <SheetTrigger asChild>
              <div>
                <SettingItem
                  icon={<User size={18} />}
                  title="Profile"
                  description={userProfile?.displayName || currentUser?.email || "Update your profile information"}
                  action={<ArrowLeft size={16} className="rotate-180" />}
                />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Edit Profile</SheetTitle>
              </SheetHeader>
              <div className="py-6">
                <ProfileForm
                  displayName={displayName}
                  setDisplayName={setDisplayName}
                  email={email}
                  setEmail={setEmail}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  address={address}
                  setAddress={setAddress}
                  isLoading={isProfileLoading}
                  handleSubmit={handleProfileSubmit}
                  emailDisabled={true}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-800">
          <div className="py-2">
            <div className="px-4 md:px-6 py-3">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</h2>
            </div>
            
            <SettingItem
              icon={<Bell size={18} />}
              title="Push Notifications"
              description="Get notified about order updates and promotions"
              action={<Switch checked={pushNotifications} onCheckedChange={togglePushNotifications} />}
            />
            
            <SettingItem
              icon={<Bell size={18} />}
              title="Email Notifications"
              description="Receive notifications via email"
              action={<Switch checked={emailNotifications} onCheckedChange={toggleEmailNotifications} />}
            />
            
            <SettingItem
              icon={<Bell size={18} />}
              title="SMS Notifications"
              description="Receive notifications via SMS"
              action={<Switch checked={smsNotifications} onCheckedChange={toggleSmsNotifications} />}
            />
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800">
          <div className="py-2">
            <div className="px-4 md:px-6 py-3">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Appearance</h2>
            </div>
            
            <SettingItem
              icon={<Moon size={18} />}
              title="Dark Mode"
              description="Toggle between light and dark theme"
              action={<Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />}
            />
            
            <SettingItem
              icon={<Globe size={18} />}
              title="Language"
              description="Change your preferred language"
              action={
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1.5 dark:text-gray-300"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                </select>
              }
            />
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800">
          <div className="py-2">
            <div className="px-4 md:px-6 py-3">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Security</h2>
            </div>
            
            <SettingItem
              icon={<Lock size={18} />}
              title="Change Password"
              description="Update your account password"
              action={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm"
                  onClick={() => navigate('/auth')}
                >
                  Change
                </Button>
              }
            />
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white dark:bg-gray-800">
          <div className="py-2">
            <div className="px-4 md:px-6 py-3">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment</h2>
            </div>
            
            <SettingItem
              icon={<CreditCard size={18} />}
              title="Payment Methods"
              description="Manage your payment options"
              action={
                <Button variant="ghost" size="sm" className="text-sm">
                  Manage
                </Button>
              }
            />
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white dark:bg-gray-800">
          <div className="p-4 md:p-6">
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
