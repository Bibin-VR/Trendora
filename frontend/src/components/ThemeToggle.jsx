import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center gap-2 group"
      aria-label="Toggle theme"
    >
      <div className={`relative w-12 h-6 rounded-full border transition-all duration-500 ${
        isDark
          ? 'bg-white/5 border-white/15 hover:border-white/30'
          : 'bg-black/5 border-black/15 hover:border-black/30'
      }`}>
        <div className={`absolute top-[3px] w-4 h-4 rounded-full transition-all duration-500 ${
          isDark
            ? 'left-[3px] bg-white/70'
            : 'left-[27px] bg-amber-400'
        }`} />
      </div>
      <div className="relative w-4 h-4 overflow-hidden">
        <Sun
          size={14}
          className={`absolute inset-0 transition-all duration-500 ${
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-70 rotate-0 scale-100'
          } ${isDark ? 'text-white' : 'text-amber-500'}`}
        />
        <Moon
          size={14}
          className={`absolute inset-0 transition-all duration-500 ${
            isDark ? 'opacity-50 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          } ${isDark ? 'text-white' : 'text-black'}`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
