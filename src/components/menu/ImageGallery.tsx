import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Search } from 'lucide-react';

interface ImageGalleryProps {
  images: Array<{ url: string; alt?: string; isMain: boolean }>;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isFullscreen) {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
        <img
          src={images[selectedImage].url}
          alt={images[selectedImage].alt || '메뉴 이미지'}
          className="w-full h-full object-cover"
          onClick={() => setIsFullscreen(true)}
        />
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-4 right-4 p-2 bg-black/50 text-white rounded-full
                   hover:bg-black/70 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
              selectedImage === index ? 'ring-2 ring-primary' : ''
            }`}
          >
            <img
              src={image.url}
              alt={image.alt || `메뉴 이미지 ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {image.isMain && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="text-xs text-white font-medium px-2 py-1 bg-black/50 rounded-full">
                  대표
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-4xl px-12">
              <img
                src={images[selectedImage].url}
                alt={images[selectedImage].alt || '메뉴 이미지'}
                className="w-full h-auto"
                onClick={(e) => e.stopPropagation()}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 
                         bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 
                         bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Thumbnails */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                          flex gap-2 p-2 bg-black/50 rounded-lg">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    className={`w-12 h-12 rounded overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`썸네일 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;