import React from 'react';

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  const themes = ['Classic', 'Modern', 'Professional', 'Green'];
  const themeKeys = ['wikipedia', 'alpha', 'uscf', 'green'];

  return (
    <div className='theme-selector'>
      <span>Theme:</span>
      {themes.map((theme, index) => (
        <button
          key={theme}
          className={`theme-btn ${currentTheme === themeKeys[index] ? 'active' : ''}`}
          onClick={() => onThemeChange(themeKeys[index])}
        >
          {theme}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
