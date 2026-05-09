import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <button
        className={`liquid-glass-toggle ${isDarkMode ? 'dark' : 'light'}`}
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
      >
        <div className="liquid-bg">
          <div className="orb pink"></div>
          <div className="orb yellow"></div>
          <div className="orb blue"></div>
        </div>
        <div className="toggle-handle">
          <div className="toggle-icon">
            {isDarkMode}
          </div>
        </div>
        <span className="toggle-text">{isDarkMode ? 'Dark' : 'Light'}</span>
      </button>
    </div>
  );
};

export default ThemeToggle;
