
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, User, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This is just a UI demo without actual profile update functionality
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
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
          <h1 className="text-lg font-semibold">My Profile</h1>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="max-w-md mx-auto p-4">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
              <AvatarImage src={currentUser?.photoURL || ""} alt="Profile picture" />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                {currentUser?.displayName?.[0] || currentUser?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full shadow-md">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-lg font-medium">{currentUser?.displayName || "Guest User"}</h2>
          <p className="text-sm text-gray-500">{currentUser?.email || ""}</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
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
              
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
