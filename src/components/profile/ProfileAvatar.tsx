import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  className?: string;
  editable?: boolean;
  photoURL?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  editMode?: boolean;
}

export function ProfileAvatar({ 
  className, 
  editable = true, 
  photoURL,
  displayName: propDisplayName,
  email: propEmail,
  editMode 
}: ProfileAvatarProps) {
  const { currentUser, updateUserProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const displayName = propDisplayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const initials = displayName.substring(0, 2).toUpperCase();
  const avatarUrl = previewUrl || photoURL || currentUser?.photoURL;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-content')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-content')
        .getPublicUrl(filePath);
        
      if (urlData) {
        // Update user profile with new avatar URL
        await updateUserProfile?.({
          photoURL: urlData.publicUrl
        });
        
        toast.success('Profile picture updated');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to update profile picture');
      // Reset preview on error
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveAvatar = async () => {
    if (!currentUser) return;
    
    try {
      setIsUploading(true);
      
      // Update profile with no avatar
      await updateUserProfile?.({
        photoURL: null
      });
      
      setPreviewUrl(null);
      toast.success('Profile picture removed');
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error('Failed to remove profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <Avatar className="h-24 w-24 border-2 border-white shadow-md">
        <AvatarImage src={avatarUrl || undefined} alt={displayName} />
        <AvatarFallback className="text-lg bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {editable && !isUploading && (
        <div className="mt-2 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="text-xs"
            asChild
          >
            <label>
              <Upload className="mr-1 h-3 w-3" />
              Change
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </Button>
          
          {avatarUrl && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-xs text-destructive hover:text-destructive"
              onClick={handleRemoveAvatar}
            >
              <X className="mr-1 h-3 w-3" />
              Remove
            </Button>
          )}
        </div>
      )}
      
      {isUploading && (
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Updating...
        </div>
      )}
    </div>
  );
}

export default ProfileAvatar;
