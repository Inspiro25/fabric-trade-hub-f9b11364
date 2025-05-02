import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Theme, UserPreferences } from '@/types/auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';

const Settings = () => {
  const { currentUser, updateProfile } = useAuth();
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: 'light',
    currency: 'USD', 
    language: 'en',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });
  
  // Extract these values for use in the component
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [emailNotifications, setEmailNotificationsEnabled] = useState(true);
  const [pushNotifications, setPushNotificationsEnabled] = useState(true);
  const [smsNotifications, setSmsNotificationsEnabled] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  // Load user data
  useEffect(() => {
    if (currentUser) {
      // Handle display name
      setDisplayName(currentUser.user_metadata?.full_name || '');
      
      // Handle phone
      const phone = currentUser.phone || currentUser.user_metadata?.phone || '';
      setPhoneNumber(phone);
      
      // Handle address
      const address = currentUser.address || currentUser.user_metadata?.address || '';
      setAddress(address);
      
      // Handle notifications
      const notifications = currentUser.user_metadata?.notifications || {
        email: true,
        push: true,
        sms: false
      };
      
      setEmailNotificationsEnabled(notifications.email);
      setPushNotificationsEnabled(notifications.push);
      setSmsNotificationsEnabled(notifications.sms);
      
      // Handle theme and currency
      setSelectedTheme((currentUser.user_metadata?.theme as Theme) || 'light');
      setSelectedCurrency(userPreferences.currency || 'USD');
    }
  }, [currentUser]);
  
  // Replace the saveSettings function
  const saveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      // Organize user data for update
      const userData = {
        displayName: displayName,
        phone: phoneNumber,
        address: address,
        preferences: {
          theme: selectedTheme,
          currency: selectedCurrency,
          notifications: {
            email: emailNotifications,
            push: pushNotifications,
            sms: smsNotifications
          }
        }
      };
      
      // Call the update function
      await updateProfile(userData);
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };
  
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    
    if (currentUser) {
      // Handle theme and currency
      setSelectedTheme(newTheme);
      setSelectedCurrency(userPreferences.currency || 'USD');
    }
  };
  
  handleThemeChange(Theme.LIGHT);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and how others see you on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={currentUser?.user_metadata?.avatar_url || ''} />
                  <AvatarFallback>{displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input 
                    id="displayName" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    placeholder="Your full name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={currentUser?.email || ''} 
                  disabled 
                  placeholder="Your email address"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed. Contact support for assistance.
                </p>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Your address"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your experience on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={selectedTheme} 
                  onValueChange={(value) => setSelectedTheme(value as Theme)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={selectedCurrency} 
                  onValueChange={setSelectedCurrency}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={userPreferences.language} 
                  onValueChange={(value) => setUserPreferences({...userPreferences, language: value})}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotificationsEnabled} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your device
                  </p>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotificationsEnabled} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via text message
                  </p>
                </div>
                <Switch 
                  checked={smsNotifications} 
                  onCheckedChange={setSmsNotificationsEnabled} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Change Password</h3>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <Button className="mt-4">Update Password</Button>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Add an extra layer of security to your account.
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Permanently delete your account and all of your data.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
