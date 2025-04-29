import React, { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
}

const Card: React.FC<CardProps> = ({
  className = '',
  children,
  hoverable = false,
  bordered = true,
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-lg shadow-sm 
        ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''} 
        ${hoverable ? 'transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ className?: string; children: ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ className?: string; children: ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <h3 className={`text-lg font-medium text-gray-900 dark:text-white ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<{ className?: string; children: ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ className?: string; children: ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
