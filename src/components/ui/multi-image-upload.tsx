import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Upload, ImageIcon, Loader2 } from 'lucide-react';
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
  const [images, setImages] = useState<string[]>(initialImages || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check if adding these would exceed maxFiles
    if (images.length + files.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} images`);
      return;
    }

    setError(null);
    setUploading(true);
    const uploadPromises: Promise<string>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds ${maxSize}MB limit`);
        continue;
      }

      uploadPromises.push(uploadFile(file));
    }

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== '');
      
      if (validUrls.length > 0) {
        const newImages = [...images, ...validUrls];
        setImages(newImages);
        onImagesChange(newImages);
        
        if (validUrls.length === 1) {
          toast.success('Image uploaded successfully');
        } else {
          toast.success(`${validUrls.length} images uploaded successfully`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading one or more images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
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
        console.error('Error uploading file:', uploadError);
        return '';
      }

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      return '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
              onClick={() => removeImage(index)}
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
            <Plus className="h-8 w-8 text-gray-400 mb-1" />
            <p className="text-sm text-gray-500 text-center px-2">Add image</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div className="flex items-center gap-2">
        <Button 
          type="button"
          variant="outline" 
          disabled={uploading || images.length >= maxFiles}
          onClick={triggerFileInput}
          className="flex items-center"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          {images.length} of {maxFiles} images | Max {maxSize}MB each
        </p>
      </div>
    </div>
  );
};

export default MultiImageUpload;
