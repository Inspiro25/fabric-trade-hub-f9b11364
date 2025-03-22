
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  primaryColor: string;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  primaryColor: '#FF6B00', // Default primary color (orange)
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize the theme state based on localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Check if there's a stored preference
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        return stored === 'true';
      }
      // If no stored preference, check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Set primary color based on dark mode
  const primaryColor = isDarkMode ? '#FF8A3D' : '#FF6B00';

  // Toggle the dark mode state
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', newValue.toString());
      }
      return newValue;
    });
  };

  // Apply or remove dark mode class on the document when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, primaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
