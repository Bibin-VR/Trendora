import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const IntroScreen = ({ onEnter }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isExiting, setIsExiting] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoaded(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => onEnter(), 800);
  };

  const bg = isDark ? 'bg-[#0a0a0a]' : 'bg-[#faf9f6]';
  const textColor = isDark ? 'text-white' : 'text-[#1a1a1a]';
  const subtleText = isDark ? 'text-white/30' : 'text-black/30';
  const subtlerText = isDark ? 'text-white/20' : 'text-black/20';
  const borderColor = isDark ? 'border-white/10' : 'border-black/10';
  const barBg = isDark ? 'bg-white/10' : 'bg-black/10';
  const barFill = isDark ? 'bg-white/60' : 'bg-black/60';
  const btnBorder = isDark ? 'border-white/20 hover:border-white/50' : 'border-black/20 hover:border-black/50';
  const btnOverlay = isDark ? 'bg-white/5 group-hover:bg-white/10' : 'bg-black/5 group-hover:bg-black/10';

  return (
    <div
      className={`fixed inset-0 z-[100] ${bg} flex flex-col items-center justify-center transition-all ${
        isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      style={{ transitionDuration: '800ms' }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Corner frames */}
      <div className={`absolute top-8 left-8 w-16 h-16 border-l border-t ${borderColor}`} />
      <div className={`absolute top-8 right-8 w-16 h-16 border-r border-t ${borderColor}`} />
      <div className={`absolute bottom-8 left-8 w-16 h-16 border-l border-b ${borderColor}`} />
      <div className={`absolute bottom-8 right-8 w-16 h-16 border-r border-b ${borderColor}`} />

      {/* Brand */}
      <div className="relative z-10 text-center">
        <div className="mb-4">
          <span className={`${subtleText} text-xs tracking-[0.5em] uppercase font-light`}>Discover Fashion</span>
        </div>

        <h1
          className={`${textColor} text-7xl md:text-9xl tracking-tight leading-none mb-2`}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          TREND
        </h1>
        <h1
          className={`${textColor} text-7xl md:text-9xl tracking-tight leading-none`}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          ORA
        </h1>

        <div className="mt-6 flex items-center justify-center gap-3">
          <div className={`h-[1px] w-12 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
          <span className={`${subtlerText} text-[10px] tracking-[0.3em] uppercase`}>Fashion Aggregator</span>
          <div className={`h-[1px] w-12 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
        </div>

        {/* Loading bar */}
        <div className="mt-12 w-64 mx-auto">
          <div className={`h-[1px] ${barBg} w-full rounded overflow-hidden`}>
            <div
              className={`h-full ${barFill} transition-all duration-300 ease-out`}
              style={{ width: `${Math.min(loadProgress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className={`${subtlerText} text-[10px] tracking-widest`}>LOADING</span>
            <span className={`${subtleText} text-[10px] font-mono`}>{Math.min(Math.round(loadProgress), 100)}%</span>
          </div>
        </div>

        {/* Enter button */}
        <div className={`mt-10 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={handleEnter}
            className={`group relative px-8 py-3 border ${btnBorder} ${textColor} text-sm tracking-[0.3em] uppercase transition-colors duration-500 bg-transparent`}
          >
            <span className="relative z-10 flex items-center gap-2">
              Enter Website
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className={`absolute inset-0 ${btnOverlay} transition-colors duration-500`} />
          </button>
        </div>
      </div>

      {/* Bottom code */}
      <div className="absolute bottom-8 right-8 text-right">
        <span className={`${isDark ? 'text-white/15' : 'text-black/15'} text-[10px] tracking-widest font-mono block`}>INITIATING</span>
        <span className={`${isDark ? 'text-white/15' : 'text-black/15'} text-[10px] tracking-widest font-mono block`}>TR-2025SS0742</span>
      </div>
    </div>
  );
};

export default IntroScreen;
