import React from 'react';

export const Checkbox = ({ 
  id, 
  className = '', 
  checked, 
  onChange,
  ...props 
}) => {
  return (
    <input 
      type="checkbox"
      id={id}
      className={`w-4 h-4 border border-gray-300 rounded cursor-pointer accent-primary-500 ${className}`}
      checked={checked}
      onChange={onChange}
      {...props}
    />
  );
};
