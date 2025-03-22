
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MultiImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
  bucketName?: string;
  folderPath?: string;
  maxFiles?: number;
  maxSize?: number; // In MB
  className?: string;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  onImagesChange,
  initialImages = [],
  bucketName = 'products',
  folderPath = '',
  maxFiles = 5,
  maxSize = 5, // Default 5MB
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>(initialImages);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images`);
      return;
    }

    setError(null);
    setIsUploading(true);

    const newImages: string[] = [...images];
    const uploadPromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds ${maxSize}MB limit`);
        continue;
      }

      const uploadPromise = (async () => {
        try {
          // Generate a unique file name
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${i}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

          // Upload file to Supabase Storage
          const { data, error: uploadError } = await supabase
            .storage
            .from(bucketName)
            .upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }

          // Get public URL
          const { data: urlData } = supabase
            .storage
            .from(bucketName)
            .getPublicUrl(filePath);

          newImages.push(urlData.publicUrl);
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(`Failed to upload ${file.name}`);
        }
      })();

      uploadPromises.push(uploadPromise);
    }

    try {
      await Promise.all(uploadPromises);
      setImages(newImages);
      onImagesChange(newImages);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error in batch upload:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        multiple
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
        {images.map((image, index) => (
          <div key={index} className="relative rounded-md overflow-hidden border border-gray-200 aspect-square">
            <img 
              src={image} 
              alt={`Product image ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
              onClick={() => handleRemoveImage(index)}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {images.length < maxFiles && (
          <div 
            onClick={triggerFileInput}
            className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors aspect-square"
          >
            <Plus className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">Add Image</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      
      <Button 
        type="button"
        variant="outline" 
        disabled={isUploading || images.length >= maxFiles}
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
            Upload Images {images.length}/{maxFiles}
          </span>
        )}
      </Button>
    </div>
  );
};

export default MultiImageUpload;
