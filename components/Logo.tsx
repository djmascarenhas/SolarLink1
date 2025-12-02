
import React, { useState } from 'react';

export const Logo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ className = '', ...props }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-full w-auto text-yellow-500"
            style={{ maxHeight: '100%', minHeight: '24px' }}
        >
            <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
        <span className="font-bold text-white tracking-tight flex items-center">
            <span className="text-blue-500">SOLAR</span>LINK
        </span>
      </div>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="SolarLink Logo"
      className={`object-contain ${className}`}
      onError={() => setImgError(true)}
      {...props}
    />
  );
};
