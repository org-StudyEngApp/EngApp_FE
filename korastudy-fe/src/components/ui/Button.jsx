import React from 'react';

export const Button = ({ 
  children, 
  className = '', 
  variant = 'default', 
  onClick, 
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 cursor-pointer border border-transparent px-4 py-2';
  
  const variantClasses = {
    default: 'bg-primary-500 text-white border-primary-500 hover:bg-blue-600 hover:border-blue-600',
    outline: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button 
      className={classes} 
      onClick={onClick} 
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};
