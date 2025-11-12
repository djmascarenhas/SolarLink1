import React from 'react';

// FIX: Extend ButtonProps with React.ButtonHTMLAttributes to accept all standard button attributes like 'type'.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-6 py-3 font-semibold rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 shadow-lg';

  const variantStyles = {
    primary: 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 focus:ring-yellow-300',
    secondary: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400',
    outline: 'bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-slate-900 focus:ring-yellow-300',
  };

  return (
    <button
      // FIX: Spread the rest of the props (...) to the button element to pass attributes like 'type' and 'onClick'.
      {...props}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
