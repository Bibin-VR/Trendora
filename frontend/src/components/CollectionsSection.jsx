import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import GenderFilter from './GenderFilter';
import { apiService } from '../services/api';

const CollectionCard = ({ collection, index }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative group cursor-pointer transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={collection.image}
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            filter: isHovered ? 'brightness(0.7)' : 'brightness(0.5)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-4 left-5 z-10">
          <span className="text-white/30 text-[11px] tracking-[0.3em] font-mono">[{collection.number}]</span>
        </div>

        <div className="absolute top-4 right-5 z-10">
          <span className="text-white/40 text-[9px] tracking-[0.2em] uppercase border border-white/10 px-2 py-0.5">
            {collection.gender}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <h3
            className="text-white text-2xl md:text-3xl mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
          >
            {collection.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs tracking-wider">{collection.subtitle}</span>
            <ArrowRight
              size={16}
              className={`text-white/40 transition-all duration-500 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}
            />
          </div>
        </div>

        <div className={`absolute inset-0 border transition-colors duration-500 ${
          isHovered ? 'border-white/20' : 'border-white/[0.06]'
        }`} />
      </div>
    </div>
  );
};

const CollectionsSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [headerVisible, setHeaderVisible] = useState(false);
  const [genderFilter, setGenderFilter] = useState('all');
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.3 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const data = await apiService.getCollections(genderFilter);
        setCollections(data.collections);
      } catch (err) {
        console.error('Failed to fetch collections:', err);
      }
      setLoading(false);
    };
    fetchCollections();
  }, [genderFilter]);

  const bg = isDark ? 'bg-[#0a0a0a]' : 'bg-[#faf9f6]';
  const textColor = isDark ? 'text-white' : 'text-[#1a1a1a]';
  const faintText = isDark ? 'text-white/20' : 'text-black/15';
  const fadedText = isDark ? 'text-white/30' : 'text-black/25';

  return (
    <section id="collections" className={`relative ${bg} py-24 md:py-32 px-8 md:px-16 lg:px-24`}>
      <div
        ref={headerRef}
        className={`mb-16 transition-all duration-1000 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <span className={`${faintText} text-[10px] tracking-[0.5em] uppercase block mb-4`}>//curated collections</span>
            <h2
              className={`${textColor} text-5xl md:text-7xl leading-none`}
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <span className={fadedText}>//</span>Shop by Style
            </h2>
          </div>
          <GenderFilter selected={genderFilter} onSelect={setGenderFilter} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className={`aspect-[16/10] ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'} animate-pulse`} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection, index) => (
            <div key={collection.id} className={collections.length === 4 && index === 3 ? 'md:col-span-2 lg:col-span-1' : ''}>
              <CollectionCard collection={collection} index={index} />
            </div>
          ))}
        </div>
      )}

      {!loading && collections.length === 0 && (
        <div className={`text-center py-20 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
          <p className="text-lg tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            No collections found for this category
          </p>
        </div>
      )}
    </section>
  );
};

export default CollectionsSection;
