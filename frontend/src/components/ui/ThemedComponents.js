// src/components/ui/ThemedComponents.js - VERSION CORRIGÉE
import React from 'react';

// Card avec classes Tailwind fixes (pas de classes dynamiques)
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Modal avec classes fixes
export const Modal = ({ children, isOpen, onClose, title, className = '' }) => {
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl w-full max-w-md border ${className}`}>
          {title && (
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  );
};

// Input avec classes fixes
export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

// Button avec classes fixes
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  ...props 
}) => {
  const baseClasses = 'rounded-lg font-medium transition-colors border';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 border-primary-600',
    secondary: 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
    success: 'bg-green-600 text-white hover:bg-green-700 border-green-600'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Table avec classes fixes
export const Table = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden border ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children }) => {
  return (
    <thead className="bg-gray-50 dark:bg-gray-900">
      {children}
    </thead>
  );
};

export const TableRow = ({ children, className = '' }) => {
  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${className}`}>
      {children}
    </tr>
  );
};

export const TableCell = ({ children, isHeader = false, className = '' }) => {
  const Component = isHeader ? 'th' : 'td';
  const textClass = isHeader 
    ? 'text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider' 
    : 'text-gray-900 dark:text-white';
  
  return (
    <Component className={`px-6 py-3 text-left text-sm ${textClass} ${className}`}>
      {children}
    </Component>
  );
};

// Alert avec classes fixes
export const Alert = ({ 
  children, 
  type = 'info', 
  title,
  className = '' 
}) => {
  const alertClasses = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
  };
  
  return (
    <div className={`p-4 rounded-lg border ${alertClasses[type]} ${className}`}>
      {title && (
        <h4 className="text-sm font-medium mb-1">{title}</h4>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
};

// Badge avec classes fixes
export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'sm',
  className = '' 
}) => {
  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    primary: 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

// Select avec classes fixes
export const Select = ({ 
  label, 
  error, 
  options = [], 
  className = '', 
  children,
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white border appearance-none cursor-pointer ${className}`}
          {...props}
        >
          {options.length > 0 
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children
          }
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
export const Text = {
  Primary: ({ children, className = '' }) => (
    <span className={`text-gray-900 dark:text-white ${className}`}>{children}</span>
  ),
  Secondary: ({ children, className = '' }) => (
    <span className={`text-gray-600 dark:text-gray-300 ${className}`}>{children}</span>
  ),
  Muted: ({ children, className = '' }) => (
    <span className={`text-gray-500 dark:text-gray-400 ${className}`}>{children}</span>
  ),
  Light: ({ children, className = '' }) => (
    <span className={`text-gray-400 dark:text-gray-500 ${className}`}>{children}</span>
  )
};