import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`loading-spinner-container ${className}`}>
      <div className={`loading-spinner spinner-${size}`}>
        <div className="spinner"></div>
      </div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
}; 