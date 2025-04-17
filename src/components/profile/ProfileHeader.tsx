
import React from 'react';
import { ArrowLeft, Pencil, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

type ProfileHeaderProps = {
  isLoggedIn: boolean;
  editMode: boolean;
  setEditMode?: (editMode: boolean) => void;
};

const ProfileHeader = ({ isLoggedIn, editMode, setEditMode }: ProfileHeaderProps) => {
  const { isDarkMode } = useTheme();
  
  const handleEditToggle = () => {
    if (setEditMode) {
      setEditMode(!editMode);
    }
  };

  return (
    <div className={cn(
      "sticky top-0 z-10 p-4 flex justify-between items-center mb-4",
      isDarkMode 
        ? "bg-gray-900 text-white" 
        : "bg-white text-gray-800 border-b border-gray-200"
    )}>
      <Link to="/">
        <Button
          variant="ghost"
          className={cn(
            "p-1 h-auto",
            isDarkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100"
          )}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      
      <h1 className="text-xl font-semibold flex-1 text-center">
        {isLoggedIn ? 'My Profile' : 'Sign In'}
      </h1>
      
      {isLoggedIn && setEditMode && (
        <Button
          variant="ghost"
          onClick={handleEditToggle}
          className={cn(
            "p-1 h-auto",
            isDarkMode 
              ? "hover:bg-gray-800 text-gray-300" 
              : "hover:bg-gray-100"
          )}
        >
          {editMode ? (
            <Check className={cn(
              "h-5 w-5",
              isDarkMode ? "text-green-400" : "text-green-600"
            )} />
          ) : (
            <Pencil className="h-5 w-5" />
          )}
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader;
