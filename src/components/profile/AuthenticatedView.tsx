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
import { useCart } from '@/hooks/use-cart';
import { AuthenticatedViewProps } from './AuthenticatedView.d';

const AuthenticatedView: React.FC<AuthenticatedViewProps> = ({
  isLoaded,
  currentUser,
  displayName,
  setDisplayName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  editMode,
  isLoading,
  handleSubmit,
  handleLogout,
  getCartCount
}) => {
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
        isLoggedIn={!!currentUser}
        editMode={editMode}
        setEditMode={undefined} // Fixed this to undefined as it's not needed here
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-1">
          <ProfileCard
            editMode={editMode}
            displayName={displayName}
            setDisplayName={setDisplayName}
            email={email}
            setEmail={setEmail}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            address={address}
            setAddress={setAddress}
            isLoading={false}
            handleSubmit={handleSubmit}
            currentUser={currentUser}
          >
            <ProfileAvatar 
              avatarUrl={currentUser.avatarUrl || currentUser.photoURL || ''} // Handle both properties
              displayName={currentUser.displayName || 'User'}
              email={currentUser.email || ''}
              phoneNumber=""
              editMode={editMode} 
            />
            <ProfileStats cartCount={getCartCount()} />
            <ProfileActions onLogout={handleLogout} />
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
                <ProfileForm
                  displayName={displayName}
                  setDisplayName={setDisplayName}
                  email={email}
                  setEmail={setEmail}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  address={address}
                  setAddress={setAddress}
                  isLoading={isLoading}
                  handleSubmit={handleSubmit}
                  emailDisabled={!!currentUser.email}
                />
              ) : (
                <ProfileInfo
                  displayName={displayName}
                  email={email}
                  phoneNumber={phoneNumber}
                  address={address}
                />
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
