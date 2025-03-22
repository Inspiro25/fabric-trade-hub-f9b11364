
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  orangeGradient: string;
  setTheme: (theme: Theme) => void; // Added setTheme function
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  primaryColor: '#FF6B00', // Default primary color (orange)
  secondaryColor: '#FF8A3D', // Default secondary color (lighter orange)
  accentColor: '#FFF0EA', // Default accent color (very light orange)
  orangeGradient: 'linear-gradient(to right, #FF6B00, #FF8A3D)',
  setTheme: () => {} // Default implementation
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize the theme state based on localStorage or system preference
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Check if there's a stored preference
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        return stored;
      }
      // If no stored preference, default to system
      return 'system';
    }
    return 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Check if there's a stored preference
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') {
        return true;
      }
      if (stored === 'light') {
        return false;
      }
      // If system preference or no preference, check system
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Function to set theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      setIsDarkMode(true);
    } else if (newTheme === 'light') {
      setIsDarkMode(false);
    } else if (newTheme === 'system') {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  };

  // Set colors based on dark mode
  const primaryColor = isDarkMode ? '#FF8A3D' : '#FF6B00';
  const secondaryColor = isDarkMode ? '#FFA264' : '#FF8A3D';
  const accentColor = isDarkMode ? '#433127' : '#FFF0EA';
  const orangeGradient = isDarkMode 
    ? 'linear-gradient(to right, #FF8A3D, #FFA264)' 
    : 'linear-gradient(to right, #FF6B00, #FF8A3D)';

  // Toggle the dark mode state
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      setTheme(newValue ? 'dark' : 'light');
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

  // Listen for system theme changes if using system theme
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      primaryColor, 
      secondaryColor, 
      accentColor,
      orangeGradient,
      setTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
