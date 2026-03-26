import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  error, 
  id, 
  type = 'text', 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`custom-input-group ${className}`}>
      {label && <label htmlFor={id} className="custom-label">{label}</label>}
      <input
        id={id}
        type={type}
        className={`custom-input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

export default Input;
