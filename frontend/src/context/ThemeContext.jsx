import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  const [autoMode, setAutoMode] = useState(() => {
    const saved = localStorage.getItem('themeAutoMode');
    return saved === 'true';
  });

  const [timeBasedMode, setTimeBasedMode] = useState(() => {
    const saved = localStorage.getItem('themeTimeBasedMode');
    return saved === 'true';
  });

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen to system preference changes
  useEffect(() => {
    if (!autoMode) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [autoMode]);

  // Time-based theme switching
  useEffect(() => {
    if (!timeBasedMode) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      // Dark mode from 6 PM (18:00) to 6 AM (6:00)
      const shouldBeDark = hour >= 18 || hour < 6;
      setTheme(shouldBeDark ? 'dark' : 'light');
    };

    // Check immediately
    checkTime();

    // Check every minute
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [timeBasedMode]);

  const toggleTheme = () => {
    // Disable auto modes when manually toggling
    setAutoMode(false);
    setTimeBasedMode(false);
    localStorage.setItem('themeAutoMode', 'false');
    localStorage.setItem('themeTimeBasedMode', 'false');
    
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setAutoThemeMode = (enabled) => {
    setAutoMode(enabled);
    localStorage.setItem('themeAutoMode', enabled.toString());
    
    if (enabled) {
      // Disable time-based mode
      setTimeBasedMode(false);
      localStorage.setItem('themeTimeBasedMode', 'false');
      
      // Apply system preference immediately
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
    }
  };

  const setTimeBasedThemeMode = (enabled) => {
    setTimeBasedMode(enabled);
    localStorage.setItem('themeTimeBasedMode', enabled.toString());
    
    if (enabled) {
      // Disable auto mode
      setAutoMode(false);
      localStorage.setItem('themeAutoMode', 'false');
      
      // Apply time-based theme immediately
      const hour = new Date().getHours();
      const shouldBeDark = hour >= 18 || hour < 6;
      setTheme(shouldBeDark ? 'dark' : 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      autoMode, 
      setAutoThemeMode,
      timeBasedMode,
      setTimeBasedThemeMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
