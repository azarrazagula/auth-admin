import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '',
  loading = false,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`custom-btn btn-${variant} btn-${size} ${className} ${loading ? 'btn-loading' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner"></span>
      ) : children}
    </button>
  );
};

export default Button;
