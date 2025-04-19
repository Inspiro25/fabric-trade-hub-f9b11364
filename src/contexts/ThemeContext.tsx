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

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: Theme;
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
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      setTheme(isDark ? darkTheme : lightTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      setTheme(prefersDark ? darkTheme : lightTheme);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      setTheme(newTheme ? darkTheme : lightTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    // Update document class when theme changes
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
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
