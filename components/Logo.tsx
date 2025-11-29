import React from 'react';

export const Logo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ className = '', ...props }) => (
  <img
    src="/logo.png"
    alt="SolarLink Logo"
    className={`object-contain ${className}`}
    {...props}
  />
);
