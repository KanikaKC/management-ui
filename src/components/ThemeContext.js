import React, { createContext, useContext, useState, useEffect } from 'react';

const themes = {
  light: {
    sidebarBackgroundColor: 'white',
    sidebarTextColor: 'black',
    backgroundColor: 'whitesmoke',
    color: 'black',
  },
  dark: {
    sidebarBackgroundColor: 'rgb(89, 88, 88)',
    sidebarTextColor: 'white',
    backgroundColor: '#333',
    color: 'white', 
  },
  blue: {
    sidebarBackgroundColor: '#34b9e5',
    sidebarTextColor: 'black',
    backgroundColor: '#add8e6',
    color: 'black',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const savedTheme = localStorage.getItem('theme') || 'light'; // Default to 'light' if not found
  const [theme, setTheme] = useState(themes[savedTheme]); // Initialize theme with saved value

  const toggleTheme = (newTheme) => {
    setTheme(themes[newTheme]);
  };

  useEffect(() => {
    // Save the currently selected theme to local storage
    localStorage.setItem('theme', Object.keys(themes).find(key => themes[key] === theme) || 'light');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
