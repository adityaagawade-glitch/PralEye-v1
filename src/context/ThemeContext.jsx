import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('praleye-theme');
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('praleye-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('praleye-theme', 'light');
      }
    } catch (e) {
      console.error('Failed to persist theme preference', e);
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
