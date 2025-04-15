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

  // Update color values for the orange theme
  const primaryColor = isDarkMode ? '#F97316' : '#EA580C';
  const secondaryColor = isDarkMode ? '#FB923C' : '#F97316';
  const accentColor = isDarkMode ? '#431407' : '#FFF7ED';
  const tertiaryColor = isDarkMode ? '#9A3412' : '#FFEDD5';
  const textColor = isDarkMode ? '#FFFFFF' : '#1F2937';
  const mutedTextColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const cardBgColor = isDarkMode ? '#1F2937' : '#FFFFFF';
  const cardBorderColor = isDarkMode ? '#374151' : '#E5E7EB';
  const sectionBgColor = isDarkMode ? '#111827' : '#F9FAFB';
  
  const orangeGradient = isDarkMode 
    ? 'linear-gradient(to right, #EA580C, #F97316)' 
    : 'linear-gradient(to right, #F97316, #FB923C)';

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
