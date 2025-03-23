
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  orangeGradient: string;
  tertiaryColor: string;
  textColor: string;
  mutedTextColor: string;
  cardBgColor: string;
  cardBorderColor: string;
  sectionBgColor: string;
  setTheme: (theme: Theme) => void;
  currentTheme: Theme;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  primaryColor: '#FF6B00',
  secondaryColor: '#FF8A3D',
  accentColor: '#FFF0EA',
  orangeGradient: 'linear-gradient(to right, #FF6B00, #FF8A3D)',
  tertiaryColor: '#FFD1BD',
  textColor: '#1A1A1A',
  mutedTextColor: '#757575',
  cardBgColor: '#FFFFFF',
  cardBorderColor: '#E5E5E5',
  sectionBgColor: '#F8F8F8',
  setTheme: () => {},
  currentTheme: 'system'
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        return stored;
      }
      return 'system';
    }
    return 'system';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') {
        return true;
      }
      if (stored === 'light') {
        return false;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

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

  // For dark mode, we'll use slightly brighter orange colors to improve contrast
  const primaryColor = isDarkMode ? '#FF8A3D' : '#FF6B00';
  const secondaryColor = isDarkMode ? '#FFA264' : '#FF8A3D';
  const accentColor = isDarkMode ? '#433127' : '#FFF0EA';
  const tertiaryColor = isDarkMode ? '#5D4A3F' : '#FFD1BD';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const mutedTextColor = isDarkMode ? '#ABABAB' : '#757575';
  const cardBgColor = isDarkMode ? '#2A2A2A' : '#FFFFFF';
  const cardBorderColor = isDarkMode ? '#3D3D3D' : '#E5E5E5';
  const sectionBgColor = isDarkMode ? '#242424' : '#F8F8F8';
  
  const orangeGradient = isDarkMode 
    ? 'linear-gradient(to right, #FF8A3D, #FFA264)' 
    : 'linear-gradient(to right, #FF6B00, #FF8A3D)';

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      setTheme(newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

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
      tertiaryColor,
      textColor,
      mutedTextColor,
      cardBgColor,
      cardBorderColor,
      sectionBgColor,
      setTheme,
      currentTheme: theme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
