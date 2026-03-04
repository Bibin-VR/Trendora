import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const AudioManager = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const lfoRef = useRef(null);
  const barsRef = useRef([]);
  const animFrameRef = useRef(null);
  const [barHeights, setBarHeights] = useState([3, 3, 3, 3, 3, 3, 3]);

  const createAmbientPad = useCallback((ctx, masterGain) => {
    const oscs = [];
    // Rich ambient chord: Cmaj7 with octave spread
    const frequencies = [65.41, 130.81, 164.81, 196.0, 246.94, 329.63];
    const types = ['sine', 'sine', 'triangle', 'sine', 'sine', 'triangle'];
    const volumes = [0.08, 0.06, 0.04, 0.05, 0.03, 0.02];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = types[i];
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Gentle detuning for lush sound
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + i * 100, ctx.currentTime);
      filter.Q.setValueAtTime(0.5, ctx.currentTime);

      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(volumes[i], ctx.currentTime + 3);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscs.push({ osc, gain: oscGain, filter });
    });

    // Slow LFO for gentle movement
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.05, ctx.currentTime);
    lfoGain.gain.setValueAtTime(15, ctx.currentTime);
    lfo.connect(lfoGain);
    oscs.forEach(o => lfoGain.connect(o.filter.frequency));
    lfo.start();

    return { oscs, lfo };
  }, []);

  const initAudio = useCallback(() => {
    if (isInitialized) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const masterGain = ctx.createGain();
      const compressor = ctx.createDynamicsCompressor();
      const reverb = ctx.createConvolver();

      // Create impulse response for reverb
      const sampleRate = ctx.sampleRate;
      const length = sampleRate * 3;
      const impulse = ctx.createBuffer(2, length, sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const data = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
        }
      }
      reverb.buffer = impulse;

      const reverbGain = ctx.createGain();
      reverbGain.gain.setValueAtTime(0.3, ctx.currentTime);

      const dryGain = ctx.createGain();
      dryGain.gain.setValueAtTime(0.7, ctx.currentTime);

      masterGain.connect(dryGain);
      masterGain.connect(reverb);
      reverb.connect(reverbGain);
      dryGain.connect(compressor);
      reverbGain.connect(compressor);
      compressor.connect(ctx.destination);

      masterGain.gain.setValueAtTime(0.4, ctx.currentTime);

      audioCtxRef.current = ctx;
      gainNodeRef.current = masterGain;

      const { oscs, lfo } = createAmbientPad(ctx, masterGain);
      oscillatorsRef.current = oscs;
      lfoRef.current = lfo;

      setIsInitialized(true);
    } catch (e) {
      console.warn('Audio initialization failed:', e);
    }
  }, [isInitialized, createAmbientPad]);

  const toggleAudio = () => {
    if (!isInitialized) {
      initAudio();
      setIsPlaying(true);
      return;
    }

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (isPlaying) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => ctx.suspend(), 1100);
      setIsPlaying(false);
    } else {
      ctx.resume().then(() => {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1.5);
        setIsPlaying(true);
      });
    }
  };

  // Animate bars
  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        setBarHeights(prev => prev.map(() => 4 + Math.random() * 14));
      } else {
        setBarHeights([3, 3, 3, 3, 3, 3, 3]);
      }
      animFrameRef.current = setTimeout(animate, 150);
    };
    animate();
    return () => clearTimeout(animFrameRef.current);
  }, [isPlaying]);

  // Play hover sound
  useEffect(() => {
    const handleHover = (e) => {
      if (!isPlaying || !audioCtxRef.current) return;
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    };

    const handleClick = () => {
      if (!isPlaying || !audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    };

    document.addEventListener('mouseenter', handleHover, true);
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('mouseenter', handleHover, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isPlaying]);

  // Cleanup
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(o => {
        try { o.osc.stop(); } catch (e) { /* ignore */ }
      });
      try { lfoRef.current?.stop(); } catch (e) { /* ignore */ }
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      className="flex items-center gap-2.5 group"
      aria-label="Toggle audio"
    >
      <div className="flex items-end gap-[2px] h-5">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className={`w-[2.5px] rounded-full transition-all ${
              isDark ? 'bg-white/40 group-hover:bg-white/60' : 'bg-black/30 group-hover:bg-black/50'
            }`}
            style={{
              height: `${h}px`,
              transitionDuration: '150ms',
              transitionTimingFunction: 'ease-out'
            }}
          />
        ))}
      </div>
      <span className={`text-[10px] tracking-[0.2em] uppercase ${
        isDark ? 'text-white/30 group-hover:text-white/50' : 'text-black/30 group-hover:text-black/50'
      } transition-colors`}>
        {isPlaying ? 'ON' : 'OFF'}
      </span>
      {isPlaying ? (
        <Volume2 size={13} className={isDark ? 'text-white/30' : 'text-black/30'} />
      ) : (
        <VolumeX size={13} className={isDark ? 'text-white/30' : 'text-black/30'} />
      )}
    </button>
  );
};

export default AudioManager;
