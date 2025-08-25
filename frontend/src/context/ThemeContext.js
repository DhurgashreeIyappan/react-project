import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: {
      primary: isDarkMode ? '#3b82f6' : '#2563eb',
      'primary-dark': isDarkMode ? '#2563eb' : '#1d4ed8',
      secondary: isDarkMode ? '#14b8a6' : '#14b8a6',
      accent: isDarkMode ? '#f59e0b' : '#f59e0b',
      background: isDarkMode ? '#111827' : '#f9fafb',
      surface: isDarkMode ? '#111827' : '#ffffff',
      'surface-alt': isDarkMode ? '#1f2937' : '#f3f4f6',
      'text-primary': isDarkMode ? '#f9fafb' : '#111827',
      'text-secondary': isDarkMode ? '#e5e7eb' : '#374151',
      'text-muted': isDarkMode ? '#9ca3af' : '#6B7280',
      border: isDarkMode ? '#374151' : '#E5E7EB',
      success: isDarkMode ? '#22C55E' : '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      highlight: isDarkMode ? '#0F172A' : '#F0FDFA',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
