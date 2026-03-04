import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, LogOut, User, ShoppingBag } from 'lucide-react';
import { heroData, aboutData } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AudioManager from './AudioManager';
import ThemeToggle from './ThemeToggle';

const HeroSection = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { cart, setIsOpen: setCartOpen } = useCart();
  const isDark = theme === 'dark';
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const aboutRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.2 }
    );
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);

  const bg = isDark ? 'bg-[#0a0a0a]' : 'bg-[#faf9f6]';
  const textColor = isDark ? 'text-white' : 'text-[#1a1a1a]';
  const mutedText = isDark ? 'text-white/50' : 'text-black/50';
  const subtleText = isDark ? 'text-white/40' : 'text-black/35';
  const faintText = isDark ? 'text-white/20' : 'text-black/15';
  const vFaintText = isDark ? 'text-white/15' : 'text-black/10';
  const borderLine = isDark ? 'border-white/[0.06]' : 'border-black/[0.06]';
  const lineBg = isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]';
  const dotColor = isDark ? 'bg-white/20' : 'bg-black/20';
  const marqueeFaint = isDark ? 'text-white/[0.07]' : 'text-black/[0.05]';
  const imgOverlayFrom = isDark ? 'from-[#0a0a0a]' : 'from-[#faf9f6]';

  return (
    <>
      {/* Hero Section */}
      <section className={`relative h-screen w-full overflow-hidden ${bg}`}>
        {/* Border frame */}
        <div className={`absolute inset-4 md:inset-6 border ${borderLine} pointer-events-none z-20`} />

        {/* Top bar: Audio + Theme toggle */}
        <div className="absolute top-6 left-8 md:left-10 z-30 flex items-center gap-5">
          <AudioManager />
          <div className={`w-[1px] h-4 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
          <ThemeToggle />
        </div>

        {/* User menu + Cart - top right */}
        <div className="absolute top-6 right-8 md:right-10 z-30 flex items-center gap-4">
          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className={`relative flex items-center gap-1.5 ${isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'} transition-colors`}
            aria-label={`Shopping cart, ${cart.item_count} items`}
          >
            <ShoppingBag size={15} />
            {cart.item_count > 0 && (
              <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-[8px] rounded-full ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                {cart.item_count}
              </span>
            )}
          </button>

          <div className={`w-[1px] h-3 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-2 ${isDark ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'} transition-colors`}
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <User size={14} />
              <span className="text-[10px] tracking-[0.2em] uppercase">{user?.name?.split(' ')[0]}</span>
            </button>
            {showUserMenu && (
              <div className={`absolute top-8 right-0 w-48 border ${isDark ? 'bg-[#111] border-white/10' : 'bg-white border-black/10'} p-3 z-50`}>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'} mb-1`}>{user?.name}</p>
                <p className={`text-[10px] ${isDark ? 'text-white/30' : 'text-black/30'} mb-3`}>{user?.email}</p>
                <button
                  onClick={logout}
                  className={`flex items-center gap-2 w-full text-left text-[10px] tracking-[0.2em] uppercase py-2 border-t ${isDark ? 'border-white/[0.06] text-white/40 hover:text-white/70' : 'border-black/[0.06] text-black/40 hover:text-black/70'} transition-colors`}
                >
                  <LogOut size={12} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hero image with parallax */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="relative w-[70%] h-[85%] max-w-4xl">
            <img
              src={heroData.heroImage}
              alt="Fashion hero"
              className="w-full h-full object-cover object-center"
              style={{ filter: isDark ? 'brightness(0.85) contrast(1.05)' : 'brightness(0.95) contrast(1.02)' }}
            />
            <div className={`absolute inset-0 bg-gradient-to-b ${imgOverlayFrom}/40 via-transparent ${imgOverlayFrom}/70`} />
            <div className={`absolute inset-0 bg-gradient-to-r ${imgOverlayFrom}/60 via-transparent ${imgOverlayFrom}/40`} />
          </div>
        </div>

        {/* Left side text */}
        <div className="absolute left-8 md:left-10 bottom-[15%] z-20">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${dotColor}`} style={{ opacity: i < 4 ? 0.5 : 0.15 }} />
                ))}
              </div>
            </div>
            <p className={`${mutedText} text-sm tracking-wide max-w-[280px] leading-relaxed`} style={{ fontFamily: "'Inter', sans-serif" }}>
              {heroData.tagline}
            </p>
          </div>
        </div>

        {/* Main brand text */}
        <div
          className={`absolute bottom-[5%] left-8 md:left-10 z-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1
            className={`${textColor} text-[clamp(4rem,12vw,11rem)] leading-[0.85] tracking-tight`}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            TREND
          </h1>
          <h1
            className={`${textColor} text-[clamp(4rem,12vw,11rem)] leading-[0.85] tracking-tight`}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            ORA
          </h1>
        </div>

        {/* Right side code */}
        <div className="absolute bottom-8 right-8 md:right-10 z-20 text-right">
          <span className={`${vFaintText} text-[10px] tracking-[0.3em] font-mono block uppercase`}>initiating</span>
          <span className={`${vFaintText} text-[10px] tracking-[0.3em] font-mono block`}>{heroData.code}</span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <ArrowDown size={16} className={isDark ? 'text-white/20' : 'text-black/20'} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`relative ${bg} py-32 px-8 md:px-16 lg:px-24`}>
        <div className={`absolute inset-x-4 md:inset-x-6 top-0 h-[1px] ${lineBg}`} />

        <div ref={aboutRef} className="max-w-6xl mx-auto opacity-0 translate-y-10 transition-all duration-1000" style={{ transitionDelay: '200ms' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <img
                src={heroData.secondaryImage}
                alt="Fashion model"
                className="w-full h-[500px] object-cover"
                style={{ filter: 'brightness(0.9)' }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2
                className={`${textColor} text-3xl md:text-4xl leading-snug mb-8`}
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}
              >
                {aboutData.headline}
              </h2>
              <p className={`${subtleText} text-sm leading-relaxed max-w-lg`} style={{ fontFamily: "'Inter', sans-serif" }}>
                {aboutData.description}
              </p>
              <div className="mt-8">
                <span className={`${faintText} text-[10px] tracking-[0.5em] uppercase`}>trendora//</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className={`relative ${bg} py-6 overflow-hidden border-y ${borderLine}`}>
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={`${marqueeFaint} text-lg tracking-[0.15em] mx-8`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {aboutData.marqueeText}
            </span>
          ))}
        </div>
      </section>
    </>
  );
};

export default HeroSection;
