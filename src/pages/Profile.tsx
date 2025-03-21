
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, User, Camera, Store, ShoppingBag, Heart, Bell, LogOut, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfilePage = () => {
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [editMode, setEditMode] = useState(false);
  
  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Scroll to top and trigger animations
    window.scrollTo(0, 0);
    
    // Populate form fields with user data
    if (currentUser) {
      setDisplayName(currentUser.displayName || userProfile?.displayName || '');
      setEmail(currentUser.email || userProfile?.email || '');
      setPhoneNumber(userProfile?.phone || '');
      setAddress(userProfile?.address || '');
    }
    
    // Set animation state after a short delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentUser, userProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('You need to log in to update your profile');
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updateUserProfile({
        displayName,
        email,
        phone: phoneNumber,
        address
      });
      
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Guest view - prompt to login
  if (!currentUser) {
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
            <h1 className="text-lg font-semibold">My Profile</h1>
          </div>
        </div>
        
        <div className={`max-w-md mx-auto p-4 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
            <div className="bg-blue-50 rounded-full p-6">
              <User className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-medium">Sign in to your account</h2>
            <p className="text-gray-500">Login to view your profile, manage orders, and track your purchases</p>
            
            <div className="w-full space-y-4 mt-4">
              <Button 
                className="w-full" 
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/auth?register=true')}
              >
                Create Account
              </Button>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Guest Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <ShoppingBag className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cart syncing</p>
                      <p className="text-xs text-gray-500">Your cart will sync to your account when you sign in</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Store className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Shop access</p>
                      <p className="text-xs text-gray-500">Browse products and add them to cart</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user view
  return (
    <div className="pb-16 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-3 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-lg font-semibold">My Profile</h1>
          </div>
          {editMode ? (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      
      {/* Profile Content */}
      <div className={`max-w-md mx-auto p-4 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
              <AvatarImage src={currentUser?.photoURL || ""} alt="Profile picture" />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                {currentUser?.displayName?.[0] || currentUser?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            {editMode && (
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full shadow-md">
                <Camera size={16} />
              </button>
            )}
          </div>
          <h2 className="text-lg font-medium">{displayName || "Guest User"}</h2>
          <p className="text-sm text-gray-500 mb-1">{email}</p>
          {phoneNumber && <p className="text-xs text-gray-400">{phoneNumber}</p>}
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <Card className="bg-white overflow-hidden border-none shadow-sm">
            <CardContent className="p-3 text-center">
              <ShoppingBag className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <p className="text-xl font-semibold">{getCartCount()}</p>
              <p className="text-xs text-gray-500">Cart Items</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white overflow-hidden border-none shadow-sm">
            <CardContent className="p-3 text-center">
              <Heart className="h-5 w-5 mx-auto mb-1 text-rose-500" />
              <p className="text-xl font-semibold">0</p>
              <p className="text-xs text-gray-500">Wishlist</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white overflow-hidden border-none shadow-sm">
            <CardContent className="p-3 text-center">
              <Bell className="h-5 w-5 mx-auto mb-1 text-amber-500" />
              <p className="text-xl font-semibold">0</p>
              <p className="text-xs text-gray-500">Notifications</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            My Orders
          </Button>
          
          <Button variant="outline" className="w-full" onClick={() => navigate('/wishlist')}>
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </Button>
          
          <Button variant="outline" className="w-full" onClick={() => navigate('/admin/login')}>
            <Store className="mr-2 h-4 w-4" />
            Shop Login
          </Button>
          
          <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        {/* Personal Information */}
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <CardTitle className="text-lg">Personal Information</CardTitle>
            {!editMode && (
              <CardDescription>Your basic information</CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-4">
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    disabled={!!currentUser?.email}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your address"
                    rows={3}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="displayName" className="text-xs text-gray-500">Full Name</Label>
                  <p>{displayName || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs text-gray-500">Email Address</Label>
                  <p>{email || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber" className="text-xs text-gray-500">Phone Number</Label>
                  <p>{phoneNumber || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="address" className="text-xs text-gray-500">Address</Label>
                  <p className="whitespace-pre-line">{address || "Not provided"}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
