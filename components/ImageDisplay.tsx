
import React from 'react';

interface ImageDisplayProps {
  src: string | null;
  blurLevel: number;
  totalQuestions: number;
}

const blurClasses = [
  'blur-none',
  'blur-sm',
  'blur-md',
  'blur-lg',
  'blur-xl',
  'blur-2xl',
  'blur-3xl',
];

const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, blurLevel, totalQuestions }) => {
  // Clamp blur level to be within the bounds of our blurClasses array
  const blurIndex = Math.min(
    blurClasses.length - 1,
    Math.max(0, totalQuestions - blurLevel)
  );
  
  const blurClass = blurClasses[blurIndex] || 'blur-3xl';
  
  return (
    <div className="w-full max-w-lg aspect-square bg-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20">
      {src && (
        <img
          src={src}
          alt="Generated art"
          className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${blurClass}`}
        />
      )}
    </div>
  );
};

export default ImageDisplay;
