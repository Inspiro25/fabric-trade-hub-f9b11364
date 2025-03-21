
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Lock, Globe, Moon, CreditCard, Monitor, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/components/ui/use-toast';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

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
      <div className="mt-0.5 text-gray-500 dark:text-gray-400">{icon}</div>
      <div>
        <h3 className="text-sm font-medium dark:text-white">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
    <div>{action}</div>
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
  
  // Language state
  const [language, setLanguage] = useState('English');
  
  useEffect(() => {
    // Initialize form with user profile data when it becomes available
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setEmail(userProfile.email || '');
      setPhoneNumber(userProfile.phone || '');
      setAddress(userProfile.address || '');
      
      // Initialize notification preferences if available
      if (userProfile.preferences?.notifications) {
        setEmailNotifications(userProfile.preferences.notifications.email);
        setPushNotifications(userProfile.preferences.notifications.push);
      }
      
      // Initialize language preference if available
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
            sms: userProfile?.preferences?.notifications?.sms || false
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
            ...(userProfile?.preferences?.notifications || {}),
            push: newValue
          }
        }
      });
      
      toast({
        title: `Push Notifications ${newValue ? 'Enabled' : 'Disabled'}`,
        description: `You will ${newValue ? 'now' : 'no longer'} receive push notifications.`,
      });
    } catch (error) {
      // Revert the UI state if update fails
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
            ...(userProfile?.preferences?.notifications || {}),
            email: newValue
          }
        }
      });
      
      toast({
        title: `Email Notifications ${newValue ? 'Enabled' : 'Disabled'}`,
        description: `You will ${newValue ? 'now' : 'no longer'} receive email notifications.`,
      });
    } catch (error) {
      // Revert the UI state if update fails
      setEmailNotifications(!newValue);
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
          language: newLanguage
        }
      });
      
      toast({
        title: "Language Updated",
        description: `Your language preference has been updated to ${newLanguage}.`,
      });
    } catch (error) {
      // Revert the UI state if update fails
      setLanguage(language);
      toast({
        title: "Update Failed",
        description: "There was an error updating your language preference.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full dark:text-gray-300" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="text-lg font-semibold dark:text-white">Settings</h1>
        </div>
      </div>
      
      {/* Settings Content */}
      <div className="p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {/* Profile Edit Sheet */}
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile</h2>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Edit Profile</SheetTitle>
                </SheetHeader>
                <div className="py-4">
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
                <div className="mt-4">
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full">Cancel</Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <Separator className="dark:bg-gray-700" />
          
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notifications</h2>
            
            <SettingItem
              icon={<Bell size={18} />}
              title="Push Notifications"
              description="Get notified about order updates and promotions"
              action={<Switch checked={pushNotifications} onCheckedChange={togglePushNotifications} />}
            />
            
            <Separator className="dark:bg-gray-700" />
            
            <SettingItem
              icon={<Bell size={18} />}
              title="Email Notifications"
              description="Receive notifications via email"
              action={<Switch checked={emailNotifications} onCheckedChange={toggleEmailNotifications} />}
            />
          </div>
          
          <Separator className="dark:bg-gray-700" />
          
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appearance</h2>
            
            <SettingItem
              icon={<Moon size={18} />}
              title="Dark Mode"
              description="Toggle between light and dark theme"
              action={<Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />}
            />
            
            <Separator className="dark:bg-gray-700" />
            
            <SettingItem
              icon={<Globe size={18} />}
              title="Language"
              description="Change your preferred language"
              action={
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="text-xs bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 dark:text-gray-300"
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
          
          <Separator className="dark:bg-gray-700" />
          
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Security</h2>
            
            <SettingItem
              icon={<Lock size={18} />}
              title="Change Password"
              description="Update your account password"
              action={
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs dark:text-gray-300" 
                  onClick={() => navigate('/auth')}
                >
                  Change
                </Button>
              }
            />
          </div>
          
          <Separator className="dark:bg-gray-700" />
          
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment</h2>
            
            <SettingItem
              icon={<CreditCard size={18} />}
              title="Payment Methods"
              description="Manage your payment options"
              action={
                <Button variant="ghost" size="sm" className="text-xs dark:text-gray-300">
                  Manage
                </Button>
              }
            />
          </div>
          
          <Separator className="dark:bg-gray-700" />
          
          <div className="p-4">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account</h2>
            
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
