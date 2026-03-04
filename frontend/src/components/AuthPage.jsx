import React, { useState } from 'react';
import { Eye, EyeOff, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const AuthPage = ({ onBack }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', gender_preference: 'all'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        if (form.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await register(form.name, form.email, form.password, form.gender_preference);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    }
    setLoading(false);
  };

  const bg = isDark ? 'bg-[#0a0a0a]' : 'bg-[#faf9f6]';
  const textColor = isDark ? 'text-white' : 'text-[#1a1a1a]';
  const mutedText = isDark ? 'text-white/40' : 'text-black/40';
  const inputClass = `w-full bg-transparent border text-sm px-5 py-3.5 focus:outline-none transition-colors tracking-wider ${
    isDark
      ? 'border-white/10 text-white focus:border-white/30 placeholder:text-white/20'
      : 'border-black/10 text-black focus:border-black/30 placeholder:text-black/20'
  }`;
  const borderColor = isDark ? 'border-white/10' : 'border-black/10';

  return (
    <div className={`fixed inset-0 z-[90] ${bg} flex items-center justify-center`}>
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Corner frames */}
      <div className={`absolute top-8 left-8 w-12 h-12 border-l border-t ${borderColor}`} />
      <div className={`absolute top-8 right-8 w-12 h-12 border-r border-t ${borderColor}`} />
      <div className={`absolute bottom-8 left-8 w-12 h-12 border-l border-b ${borderColor}`} />
      <div className={`absolute bottom-8 right-8 w-12 h-12 border-r border-b ${borderColor}`} />

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className={`absolute top-8 left-20 flex items-center gap-2 ${mutedText} hover:${isDark ? 'text-white/70' : 'text-black/70'} transition-colors text-xs tracking-[0.2em] uppercase z-10`}
        >
          <ArrowLeft size={14} />
          Back
        </button>
      )}

      <div className="relative z-10 w-full max-w-md px-8">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1
            className={`${textColor} text-5xl mb-2`}
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            TRENDORA
          </h1>
          <p className={`${mutedText} text-xs tracking-[0.3em] uppercase`}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              name="name"
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              required={!isLogin}
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`${inputClass} pr-12`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 ${mutedText}`}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {!isLogin && (
            <div>
              <label className={`${mutedText} text-[10px] tracking-[0.2em] uppercase block mb-2`}>Gender Preference</label>
              <div className="flex gap-2">
                {['all', 'women', 'men', 'unisex'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, gender_preference: g })}
                    className={`flex-1 py-2 text-[10px] tracking-[0.2em] uppercase border transition-all ${
                      form.gender_preference === g
                        ? isDark ? 'border-white/30 text-white bg-white/5' : 'border-black/30 text-black bg-black/5'
                        : isDark ? 'border-white/[0.06] text-white/30' : 'border-black/[0.06] text-black/30'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-xs tracking-wider text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full border text-xs tracking-[0.3em] uppercase px-6 py-4 transition-colors duration-300 flex items-center justify-center gap-2 ${
              isDark
                ? 'border-white/20 text-white hover:bg-white/5'
                : 'border-black/20 text-black hover:bg-black/5'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ChevronRight size={12} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className={`${mutedText} text-xs tracking-wider hover:${isDark ? 'text-white/60' : 'text-black/60'} transition-colors`}
          >
            {isLogin ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
