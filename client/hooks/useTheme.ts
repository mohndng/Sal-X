import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const item = window.localStorage.getItem('sal-x-theme');
      return item ? (item as Theme) : 'dark';
    } catch (error) {
      console.error(error);
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    try {
      window.localStorage.setItem('sal-x-theme', theme);
    } catch (error) {
      console.error(error);
    }
  }, [theme]);

  return [theme, toggleTheme];
}

export default useTheme;