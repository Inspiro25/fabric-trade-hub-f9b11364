
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  // Add these for backward compatibility
  toggleDarkMode: () => void;
  setTheme: (theme: string) => void;
  currentTheme: string;
  primaryColor: string;
  sectionBgColor: string;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  toggleDarkMode: () => {},
  setTheme: () => {},
  currentTheme: 'light',
  primaryColor: '#f97316', // Orange primary color
  sectionBgColor: 'bg-gray-50',
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user previously set a preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    
    // Apply/remove dark class to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // For backward compatibility
  const toggleDarkMode = toggleTheme;
  
  const setTheme = (theme: string) => {
    const isDark = theme === 'dark';
    setIsDarkMode(isDark);
    localStorage.setItem('theme', theme);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme,
      toggleDarkMode,
      setTheme,
      currentTheme: isDarkMode ? 'dark' : 'light',
      primaryColor: isDarkMode ? '#f97316' : '#f97316', // Orange color in both modes
      sectionBgColor: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
