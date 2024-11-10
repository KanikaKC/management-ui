import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import './Appearance.css'; // Ensure your CSS file is updated
import themeImage from './Assets/theme.png'; // Update the path accordingly
import checkmarkImage from './Assets/checkmark-bold.png'; // Import your checkmark PNG

const Appearance = () => {
  const { toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('theme') || 'light'); // Retrieve theme from local storage

  useEffect(() => {
    // Apply the selected theme when the component mounts
    toggleTheme(selectedTheme);
  }, [selectedTheme, toggleTheme]);

  const handleThemeChange = (theme) => {
    if (theme !== selectedTheme) {
      setSelectedTheme(theme); // Change the selected theme
      localStorage.setItem('theme', theme); // Store selected theme in local storage
      toggleTheme(theme); // Apply the new theme
    }
  };

  return (
    <div className="appearance-settings">
      <h2 className="appearance-heading">Appearance</h2>
      <span 
        onClick={() => setIsOpen(!isOpen)} 
        className={`theme-toggle ${isOpen ? 'active' : ''}`}
      >
        Themes
      </span>
      {isOpen && (
        <div className="theme-list">
          {['light', 'dark', 'blue'].map((theme) => (
            <div key={theme} className="theme-option" onClick={() => handleThemeChange(theme)}>
              <img src={themeImage} alt={`${theme} theme`} className="theme-icon" />
              <span>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</span>
              <div className={`circle ${selectedTheme === theme ? 'selected' : ''}`}>
                {selectedTheme === theme && <img src={checkmarkImage} alt="checkmark" className="checkmark" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appearance;
