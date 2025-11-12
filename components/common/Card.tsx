
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;
