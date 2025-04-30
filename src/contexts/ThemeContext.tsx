
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
  cardBgColor: string;
  cardBorderColor: string;
  sectionBgColor: string;
}

type ThemeType = 'light' | 'dark' | 'system';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
  setTheme: (theme: ThemeType) => void;
  currentTheme: ThemeType;
};

const lightTheme: Theme = {
  primaryColor: '#2563EB',
  secondaryColor: '#3B82F6',
  accentColor: '#EFF6FF',
  textColor: '#1A1A1A',
  mutedTextColor: '#757575',
  cardBgColor: '#FFFFFF',
  cardBorderColor: '#E5E5E5',
  sectionBgColor: '#F8F8F8',
};

const darkTheme: Theme = {
  primaryColor: '#60A5FA',
  secondaryColor: '#3B82F6',
  accentColor: '#1E3A8A',
  textColor: '#FFFFFF',
  mutedTextColor: '#9CA3AF',
  cardBgColor: '#1F2937',
  cardBorderColor: '#374151',
  sectionBgColor: '#111827',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setThemeState] = useState<Theme>(lightTheme);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('system');

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      const isDark = savedTheme === 'dark' || 
                    (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDarkMode(isDark);
      setThemeState(isDark ? darkTheme : lightTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      setThemeState(prefersDark ? darkTheme : lightTheme);
      setCurrentTheme('system');
    }
  }, []);

  // Effect to handle system theme changes when using 'system' setting
  useEffect(() => {
    if (currentTheme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      setThemeState(e.matches ? darkTheme : lightTheme);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newIsDark = !prev;
      setThemeState(newIsDark ? darkTheme : lightTheme);
      setCurrentTheme(newIsDark ? 'dark' : 'light');
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
      return newIsDark;
    });
  };

  const setTheme = (newTheme: ThemeType) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      setThemeState(prefersDark ? darkTheme : lightTheme);
    } else {
      const isDark = newTheme === 'dark';
      setIsDarkMode(isDark);
      setThemeState(isDark ? darkTheme : lightTheme);
    }
  };

  useEffect(() => {
    // Update document class when theme changes
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme, setTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
