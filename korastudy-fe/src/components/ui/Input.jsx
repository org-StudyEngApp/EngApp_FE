import React from 'react';

export const Input = ({ 
  className = '', 
  type = 'text', 
  placeholder = '',
  ...props 
}) => {
  return (
    <input 
      type={type}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm transition-colors duration-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 placeholder-gray-400 ${className}`}
      placeholder={placeholder}
      {...props}
    />
  );
};
