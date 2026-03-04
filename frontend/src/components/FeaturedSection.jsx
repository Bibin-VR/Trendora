import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, ShoppingBag, ArrowRight, Heart, ChevronRight, ShoppingCart } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import GenderFilter from './GenderFilter';
import { featuredProducts as allProducts, brandShowcase, brands as allBrands } from '../data/mockData';

/* ======================== PRODUCT CARD ======================== */
const ProductCard = ({ product, index, isFavorited, onToggleFavorite, onAddToCart }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden aspect-[3/4] ${isDark ? 'bg-[#111]' : 'bg-[#f0eeeb]'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Discount badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-white/10 backdrop-blur-sm text-white text-[10px] tracking-wider px-2.5 py-1 border border-white/10">
            -{product.discount}%
          </span>
        </div>

        {/* Gender badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/10 backdrop-blur-sm text-white text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border border-white/10">
            {product.gender}
          </span>
        </div>

        {/* Favorite + Shop overlay */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product.id); }}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-white/20 transition-colors duration-300 flex items-center gap-2"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
            className={`bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs p-2.5 hover:bg-white/20 transition-colors duration-300 ${
              isFavorited ? 'text-red-400' : ''
            }`}
          >
            <Heart size={14} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className={`absolute inset-0 border transition-colors duration-500 ${
          isHovered
            ? isDark ? 'border-white/20' : 'border-black/20'
            : isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'
        }`} />
      </div>

      <div className="pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`${isDark ? 'text-white/30' : 'text-black/35'} text-[10px] tracking-[0.2em] uppercase`}>{product.brand}</span>
          <span className={isDark ? 'text-white/10' : 'text-black/10'}>|</span>
          <span className={`${isDark ? 'text-white/20' : 'text-black/20'} text-[10px] flex items-center gap-1`}>
            <ExternalLink size={8} />
            {product.source}
          </span>
        </div>
        <h4 className={`${isDark ? 'text-white/80' : 'text-black/80'} text-sm mb-2`} style={{ fontFamily: "'Inter', sans-serif" }}>
          {product.name}
        </h4>
        <div className="flex items-center gap-3">
          <span className={`${isDark ? 'text-white' : 'text-[#1a1a1a]'} text-sm font-medium`}>${product.sale_price.toFixed(2)}</span>
          <span className={`${isDark ? 'text-white/25' : 'text-black/25'} text-xs line-through`}>${product.original_price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

/* ======================== BRAND CARD ======================== */
const BrandCard = ({ brand }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex-shrink-0 w-[260px] group cursor-pointer">
      <div className={`relative overflow-hidden aspect-square border transition-colors duration-500 ${
        isDark ? 'bg-[#111] border-white/[0.06] group-hover:border-white/20' : 'bg-[#f0eeeb] border-black/[0.06] group-hover:border-black/20'
      }`}>
        <img
          src={brand.image}
          alt={brand.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ filter: 'brightness(0.8)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-white/30 text-[10px] tracking-wider block mb-1">/Brand:</span>
          <span className="text-white/70 text-sm">{brand.name}</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-white/30 text-[10px] tracking-wider">/source:</span>
            <span className="text-white/50 text-[10px]">{brand.platform}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ======================== MAIN FEATURED SECTION ======================== */
const FeaturedSection = () => {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const isDark = theme === 'dark';
  const [headerVisible, setHeaderVisible] = useState(false);
  const [brandsHeaderVisible, setBrandsHeaderVisible] = useState(false);
  const [genderFilter, setGenderFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const brandsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.target === headerRef.current && entry.isIntersecting) setHeaderVisible(true);
          if (entry.target === brandsRef.current && entry.isIntersecting) setBrandsHeaderVisible(true);
        });
      },
      { threshold: 0.2 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    if (brandsRef.current) observer.observe(brandsRef.current);
    return () => observer.disconnect();
  }, []);

  // Filter products from mock data
  useEffect(() => {
    setLoading(true);
    const filtered = genderFilter === 'all'
      ? allProducts
      : allProducts.filter(p => p.gender === genderFilter || p.gender === 'unisex');
    setProducts(filtered.slice(0, 8));
    setLoading(false);
  }, [genderFilter]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId); else next.add(productId);
      return next;
    });
  };

  const bg = isDark ? 'bg-[#0a0a0a]' : 'bg-[#faf9f6]';
  const textColor = isDark ? 'text-white' : 'text-[#1a1a1a]';
  const faintText = isDark ? 'text-white/20' : 'text-black/15';
  const fadedText = isDark ? 'text-white/30' : 'text-black/25';
  const lineBg = isDark ? 'bg-white/[0.06]' : 'bg-black/[0.06]';
  const borderLine = isDark ? 'border-white/[0.06]' : 'border-black/[0.06]';

  return (
    <>
      {/* Featured Products */}
      <section id="featured" className={`relative ${bg} py-24 md:py-32 px-8 md:px-16 lg:px-24`}>
        <div className={`absolute inset-x-4 md:inset-x-6 top-0 h-[1px] ${lineBg}`} />

        <div
          ref={headerRef}
          className={`mb-16 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <span className={`${faintText} text-[10px] tracking-[0.5em] uppercase block mb-4`}>//best deals</span>
              <h2 className={`${textColor} text-5xl md:text-7xl leading-none`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Your Style <span className={fadedText}>Our</span> Prices
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <GenderFilter selected={genderFilter} onSelect={setGenderFilter} />
              <div className={`flex items-center gap-2 ${fadedText} text-sm cursor-pointer group`}>
                <span className="tracking-wider">View All</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`aspect-[3/4] ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'} animate-pulse`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isFavorited={favorites.has(product.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={(id) => addToCart(id)}
              />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className={`text-center py-20 ${fadedText}`}>
            <p className="text-lg tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              No products found for this category
            </p>
          </div>
        )}
      </section>

      {/* Brand Showcase */}
      <section id="brands" className={`relative ${bg} py-24 md:py-32 overflow-hidden`}>
        <div className={`absolute inset-x-4 md:inset-x-6 top-0 h-[1px] ${lineBg}`} />

        <div className="px-8 md:px-16 lg:px-24 mb-12">
          <div
            ref={brandsRef}
            className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 transition-all duration-1000 ${
              brandsHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div>
              <span className={`${faintText} text-[10px] tracking-[0.5em] uppercase block mb-4`}>//partner brands</span>
              <h2 className={`${textColor} text-5xl md:text-7xl leading-none`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Curated <span className={fadedText}>Sources</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Scrolling brand carousel */}
        <div className="relative">
          <div className="flex gap-4 animate-scroll-brands pl-8">
            {[...brandShowcase, ...brandShowcase, ...brandShowcase].map((brand, i) => (
              <BrandCard key={`brand-${i}`} brand={brand} />
            ))}
          </div>
        </div>

        {/* Brand logos strip */}
        <div className="mt-16 px-8 md:px-16 lg:px-24">
          <div className={`border-t border-b ${borderLine} py-8`}>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {allBrands.map((brand) => (
                <span
                  key={brand.id}
                  className={`${isDark ? 'text-white/15 hover:text-white/40' : 'text-black/15 hover:text-black/40'} text-lg md:text-xl tracking-[0.2em] transition-colors duration-500 cursor-pointer`}
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative ${bg} py-16 px-8 md:px-16 lg:px-24`}>
        <div className={`absolute inset-x-4 md:inset-x-6 top-0 h-[1px] ${lineBg}`} />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <h3 className={`${textColor} text-3xl mb-4`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                TREND<br />ORA
              </h3>
              <p className={`${isDark ? 'text-white/25' : 'text-black/25'} text-xs leading-relaxed`} style={{ fontFamily: "'Inter', sans-serif" }}>
                Curating the best fashion from global brands at prices you'll love.
              </p>
            </div>

            <div>
              <span className={`${fadedText} text-[10px] tracking-[0.3em] uppercase block mb-4`}>Collections</span>
              {['Streetwear', 'Formal', 'Luxury', 'Athleisure', 'Casual'].map(item => (
                <a key={item} href="#collections" className={`block ${isDark ? 'text-white/20 hover:text-white/50' : 'text-black/20 hover:text-black/50'} text-sm mb-2 transition-colors`}>
                  {item}
                </a>
              ))}
            </div>

            <div>
              <span className={`${fadedText} text-[10px] tracking-[0.3em] uppercase block mb-4`}>Company</span>
              {['About Us', 'How It Works', 'Careers', 'Press', 'Contact'].map(item => (
                <a key={item} href="#about" className={`block ${isDark ? 'text-white/20 hover:text-white/50' : 'text-black/20 hover:text-black/50'} text-sm mb-2 transition-colors`}>
                  {item}
                </a>
              ))}
            </div>

            <div>
              <span className={`${fadedText} text-[10px] tracking-[0.3em] uppercase block mb-4`}>Support</span>
              {['FAQ', 'Shipping', 'Returns', 'Privacy Policy', 'Terms'].map(item => (
                <a key={item} href="#" className={`block ${isDark ? 'text-white/20 hover:text-white/50' : 'text-black/20 hover:text-black/50'} text-sm mb-2 transition-colors`}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className={`border-t ${borderLine} pt-8 flex flex-col md:flex-row items-center justify-between gap-4`}>
            <span className={`${isDark ? 'text-white/15' : 'text-black/15'} text-[10px] tracking-[0.3em]`}>
              © 2025 TRENDORA. ALL RIGHTS RESERVED.
            </span>
            <div className="flex items-center gap-6">
              {['Twitter', 'Instagram', 'TikTok', 'Pinterest'].map(social => (
                <a key={social} href="#" className={`${isDark ? 'text-white/15 hover:text-white/40' : 'text-black/15 hover:text-black/40'} text-[10px] tracking-[0.2em] uppercase transition-colors`}>
                  {social}
                </a>
              ))}
            </div>
          </div>
          <div className={`border-t ${borderLine} pt-6 mt-2 flex items-center justify-center`}>
            <span
              className={`${isDark ? 'text-white/20' : 'text-black/20'} text-[11px] tracking-[0.5em] uppercase`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.6em' }}
            >
              BIBIN V R
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FeaturedSection;
