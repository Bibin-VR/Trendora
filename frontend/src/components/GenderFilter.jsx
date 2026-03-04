import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const genders = [
  { id: 'all', label: 'All' },
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'unisex', label: 'Unisex' }
];

const GenderFilter = ({ selected, onSelect }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-1">
      {genders.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelect(g.id)}
          className={`relative px-4 py-2 text-[11px] tracking-[0.25em] uppercase transition-all duration-400 border ${
            selected === g.id
              ? isDark
                ? 'border-white/30 text-white bg-white/5'
                : 'border-black/30 text-black bg-black/5'
              : isDark
                ? 'border-white/[0.06] text-white/30 hover:text-white/60 hover:border-white/15 bg-transparent'
                : 'border-black/[0.06] text-black/30 hover:text-black/60 hover:border-black/15 bg-transparent'
          }`}
        >
          {g.label}
          {selected === g.id && (
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1px] ${
              isDark ? 'bg-white/50' : 'bg-black/50'
            }`} />
          )}
        </button>
      ))}
    </div>
  );
};

export default GenderFilter;
