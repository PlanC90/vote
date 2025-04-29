import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    className = '', 
    fullWidth = false, 
    leftAddon,
    rightAddon,
    ...props 
  }, ref) => {
    const inputClasses = `
      block px-4 py-2 
      bg-white dark:bg-gray-800 
      border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
      rounded-md shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
      placeholder-gray-400 dark:placeholder-gray-500
      text-gray-900 dark:text-gray-100
      ${leftAddon ? 'rounded-l-none' : ''}
      ${rightAddon ? 'rounded-r-none' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className={`flex ${fullWidth ? 'w-full' : ''}`}>
          {leftAddon && (
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              {leftAddon}
            </span>
          )}
          
          <input 
            ref={ref}
            className={inputClasses} 
            {...props} 
          />
          
          {rightAddon && (
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              {rightAddon}
            </span>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
