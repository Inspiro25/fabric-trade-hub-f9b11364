
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  initialImage?: string;
  bucketName?: string;
  folderPath?: string;
  fileTypes?: string;
  maxSize?: number; // In MB
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  initialImage,
  bucketName = 'products',
  folderPath = '',
  fileTypes = 'image/*',
  maxSize = 5, // Default 5MB
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create a preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Get current authentication state
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required to upload files');
      }

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      console.log(`Uploading to bucket: ${bucketName}, path: ${filePath}`);

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase
        .storage
        .from(bucketName)
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Call the callback with the URL
      onUploadComplete(urlData.publicUrl);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file. Please try again.');
      toast.error('Failed to upload file');
      // Revoke preview URL
      if (preview && preview !== initialImage) {
        URL.revokeObjectURL(preview);
        setPreview(initialImage || null);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    // Revoke preview URL if it's not the initial image
    if (preview && preview !== initialImage) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onUploadComplete('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Input
        type="file"
        ref={fileInputRef}
        accept={fileTypes}
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-40 object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
            onClick={handleRemoveImage}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          onClick={triggerFileInput}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to upload an image</p>
          <p className="text-xs text-gray-400 mt-1">Maximum size: {maxSize}MB</p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      
      <Button 
        type="button"
        variant="outline" 
        disabled={isUploading}
        onClick={triggerFileInput}
        className="mt-2"
      >
        {isUploading ? (
          <span className="flex items-center">
            <Upload className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </span>
        ) : (
          <span className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            {preview ? 'Change Image' : 'Upload Image'}
          </span>
        )}
      </Button>
    </div>
  );
};

export default FileUpload;
