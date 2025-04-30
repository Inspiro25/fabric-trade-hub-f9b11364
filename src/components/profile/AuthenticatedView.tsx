
import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileForm from './ProfileForm';
import ProfileAvatar from './ProfileAvatar';
import ProfileActions from './ProfileActions';
import ProfileStats from './ProfileStats';
import ProfileInfo from './ProfileInfo';
import ProfileCard from './ProfileCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const AuthenticatedView: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-gray-600">You need to be logged in to view your profile.</p>
        <Button className="mt-4" asChild>
          <a href="/auth/login">Login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        title="My Profile"
        description="Manage your account details and preferences"
        editMode={editMode}
        onEditToggle={() => setEditMode(!editMode)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-1">
          <ProfileCard>
            <ProfileAvatar 
              avatarUrl={currentUser.photoURL || currentUser.avatarUrl || ''}
              displayName={currentUser.displayName || 'User'}
              email={currentUser.email || ''}
              phoneNumber=""
              editMode={editMode} 
            />
            <ProfileStats orders={18} reviews={5} following={12} />
            <ProfileActions />
          </ProfileCard>
        </div>

        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="reviews">My Reviews</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="p-0">
              {editMode ? (
                <ProfileForm />
              ) : (
                <ProfileInfo />
              )}
            </TabsContent>
            
            <TabsContent value="orders">
              <p className="text-gray-600">Your order history will appear here.</p>
            </TabsContent>
            
            <TabsContent value="reviews">
              <p className="text-gray-600">Your reviews will appear here.</p>
            </TabsContent>
            
            <TabsContent value="following">
              <p className="text-gray-600">Shops and products you're following will appear here.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedView;
