
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@/types/auth';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the Theme enum from types/auth.ts
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === Theme.LIGHT || savedTheme === Theme.DARK || savedTheme === Theme.SYSTEM)) {
      return savedTheme as Theme;
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return Theme.DARK;
    }
    
    return Theme.LIGHT;
  });
  
  const isDarkMode = theme === Theme.DARK || 
    (theme === Theme.SYSTEM && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const toggleDarkMode = () => {
    setTheme(isDarkMode ? Theme.LIGHT : Theme.DARK);
  };
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, isDarkMode]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
