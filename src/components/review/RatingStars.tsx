import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  onChange, 
  readonly = false,
  size = 'md'
}) => {
  const handleClick = (index: number) => {
    if (!readonly && onChange) {
      onChange(index + 0.5);
    }
  };

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center">
      {[0, 1, 2, 3, 4].map((index) => (
        <div key={index} className="relative">
          <Star
            className={`${sizes[size]} ${
              index + 1 <= Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${!readonly ? 'cursor-pointer' : ''}`}
            onClick={() => handleClick(index)}
          />
          {index + 0.5 === rating && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: '50%' }}
            >
              <Star
                className={`${sizes[size]} text-yellow-400 fill-current`}
              />
            </div>
          )}
        </div>
      ))}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-500">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;