
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ProfileHeaderProps = {
  isLoggedIn: boolean;
  editMode?: boolean;
  setEditMode?: (value: boolean) => void;
};

const ProfileHeader = ({ isLoggedIn, editMode, setEditMode }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
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
        {isLoggedIn ? (
          editMode !== undefined && setEditMode !== undefined ? (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          ) : null
        ) : (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
