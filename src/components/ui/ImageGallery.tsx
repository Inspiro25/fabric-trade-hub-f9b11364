
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AspectRatio } from './aspect-ratio';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [currentImage, setCurrentImage] = useState(0);

  // Handle case with no images
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <AspectRatio ratio={1}>
          <img
            src={images[currentImage]}
            alt={`${alt} - image ${currentImage + 1}`}
            className="object-cover w-full h-full rounded-lg"
          />
        </AspectRatio>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 shadow-sm hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 shadow-sm hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={cn("flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2", 
                index === currentImage ? "border-blue-500" : "border-transparent"
              )}
            >
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
