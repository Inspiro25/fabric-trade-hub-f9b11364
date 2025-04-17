import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { ArrowLeft, Save, Settings, Store, User, Bell, Lock, Globe, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getShopById, updateShop } from '@/lib/supabase/shops';
import { Shop } from '@/lib/shops/types';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopName, setShopName] = useState('');
  const [shopEmail, setShopEmail] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  useEffect(() => {
    // Check if user is authenticated as an admin
    const storedShopId = sessionStorage.getItem('adminShopId');
    if (!storedShopId) {
      toast({
        title: "Access denied",
        description: "You must be logged in as an administrator",
        variant: "destructive"
      });
      navigate('/admin/login');
      return;
    }

    // Fetch shop data from the database
    const fetchShopData = async () => {
      try {
        const shopData = await getShopById(storedShopId);
        if (shopData) {
          setShop(shopData);
          setShopName(shopData.name);
          setShopEmail(shopData.ownerEmail);
          setShopPhone(shopData.phoneNumber);
          setShopAddress(shopData.address);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch shop data",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch shop data",
          variant: "destructive"
        });
      }
    };

    fetchShopData();
  }, [navigate]);

  const handleSaveSettings = async () => {
    if (!shop) {
      console.error('No shop data available');
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        name: shopName,
        ownerEmail: shopEmail,
        phoneNumber: shopPhone,
        address: shopAddress,
        description: shop.description,
        logo: shop.logo,
        coverImage: shop.coverImage,
        status: shop.status,
        isVerified: shop.isVerified
      };

      console.log('Updating shop with data:', {
        shopId: shop.id,
        updateData
      });

      const success = await updateShop(shop.id, updateData);
      console.log('Update result:', success);
      
      if (success) {
        // Update the local shop state with new values
        const updatedShop = {
          ...shop,
          name: shopName,
          ownerEmail: shopEmail,
          phoneNumber: shopPhone,
          address: shopAddress
        };
        console.log('Updating local shop state:', updatedShop);
        setShop(updatedShop);
        
        toast({
          title: "Settings saved",
          description: "Your shop settings have been updated successfully"
        });
      } else {
        console.error('Failed to update shop');
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password do not match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate changing password
    setTimeout(() => {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully"
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4" 
          onClick={() => navigate('/admin/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Shop Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your shop's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input 
                  id="shopName" 
                  value={shopName} 
                  onChange={(e) => setShopName(e.target.value)} 
                  placeholder="Enter your shop name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopEmail">Email Address</Label>
                <Input 
                  id="shopEmail" 
                  type="email" 
                  value={shopEmail} 
                  onChange={(e) => setShopEmail(e.target.value)} 
                  placeholder="Enter your email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopPhone">Phone Number</Label>
                <Input 
                  id="shopPhone" 
                  value={shopPhone} 
                  onChange={(e) => setShopPhone(e.target.value)} 
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopAddress">Address</Label>
                <Input 
                  id="shopAddress" 
                  value={shopAddress} 
                  onChange={(e) => setShopAddress(e.target.value)} 
                  placeholder="Enter your shop address"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications about orders and updates</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notificationsEnabled} 
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch 
                  id="emailNotifications" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <Switch 
                  id="smsNotifications" 
                  checked={smsNotifications} 
                  onCheckedChange={setSmsNotifications}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Update your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  placeholder="Enter your current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Enter your new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Confirm your new password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleChangePassword} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings; 