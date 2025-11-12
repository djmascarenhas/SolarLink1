import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 245 60"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label="SolarLink Logo"
  >
    {/* Sun Icon */}
    <path
      d="M110.6 28.7c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm12.6-11.2 3.1-1.2c.8-.3 1.3-1.1 1.1-2-.2-.8-1-1.3-1.8-1.1l-3.1 1.2c-.8.3-1.3 1.1-1.1 2 .3.8 1 1.3 1.8 1.1zm-25.2-2.3-3.1-1.2c-.8-.3-1.7.2-2 1-.3.8.2 1.7 1 2l3.1 1.2c.8.3 1.7-.2 2-1-.2-.8-.2-1.7-1-2zm14.8 15.6 2.1-2.1c.6-.6.6-1.5 0-2.1s-1.5-.6-2.1 0l-2.1 2.1c-.6.6-.6 1.5 0 2.1.6.6 1.5.6 2.1 0zm-20.9-4.2-2.1-2.1c-.6-.6-1.5-.6-2.1 0s-.6 1.5 0 2.1l2.1 2.1c.6.6 1.5.6 2.1 0 .6-.5.6-1.5 0-2.1zm12.5 8.9c-2.1 0-4-1.3-4.7-3.3-.3-.8-1.2-1.3-2-1s-1.3 1.2-1 2c.9 2.8 3.5 4.8 6.6 4.8s5.7-2 6.6-4.8c.3-.8-.2-1.7-1-2s-1.7.2-2 1c-.7 2-2.5 3.3-4.5 3.3zm0-24.3C100 1.2 90.5 0 82.2 4.1l-40.4 26C38 32.5 36 36.4 36 40.6h46.2c10.8 0 19.6-8.8 19.6-19.6 0-5.6-2.3-10.7-6.2-14.5z"
      fill="#FBBF24" // yellow-400
    />
    {/* Panel */}
    <path
      d="M5.1 40.6 74.4 4.1 92.2 40.6H5.1z"
      fill="#1E40AF" // blue-700
    />
    {/* Panel Lighter parts */}
    <path d="M41.8 24.8 5.1 40.6h29.5l7.2-15.8z" fill="#3B82F6" />
    <path d="M68 11.4 41.8 24.8l12 15.8h29.8L68 11.4z" fill="#3B82F6" />
    <path d="M85.7 4.1 68 11.4l19.5 29.2h5.7L85.7 4.1z" fill="#3B82F6" />
    
    {/* Text */}
    <text
      x="168"
      y="25"
      fontFamily="Poppins, sans-serif"
      fontSize="20"
      fontWeight="700"
      fill="white" // Adapted for dark background
      textAnchor="middle"
      dominantBaseline="middle"
    >
      SOLARLINK
    </text>
    <text
      x="168"
      y="42"
      fontFamily="Poppins, sans-serif"
      fontSize="7"
      fontWeight="500"
      fill="#9CA3AF" // gray-400
      textAnchor="middle"
      letterSpacing="1.5"
      dominantBaseline="middle"
    >
      SOLAR SOLUTIONS
    </text>
  </svg>
);
