import { useEffect, useState } from 'react';
import { LionMascot } from './LionMascot';
import { Confetti } from './Confetti';

interface ZoneCelebrationProps {
  zone: 'meadow-complete' | 'forest-complete' | 'mountain-complete' | 'dragon-complete' | 'summit';
  onDone: () => void;
}

const ZONE_DATA = {
  'meadow-complete': {
    title: 'Meadow Complete!',
    subtitle: 'The Deep Forest awaits...',
    nextZone: 'Next up: Deep Forest — questions step up!',
    bg: 'linear-gradient(160deg, #a8e6cf 0%, #dcedc1 40%, #ffd3b6 100%)',
    iconBg: 'linear-gradient(135deg, #81C784, #4CAF50)',
    icon: '🌻',
    emojis: ['🌸', '🌻', '🌷', '🌺', '🌼', '🐝', '🦋', '🌿'],
    color: '#2E7D32',
    lionMood: 'happy' as const,
  },
  'forest-complete': {
    title: 'Forest Conquered!',
    subtitle: 'The Mountain Pass lies ahead!',
    nextZone: 'Next up: Mountain Pass — hard questions!',
    bg: 'linear-gradient(160deg, #b2dfdb 0%, #80cbc4 40%, #a5d6a7 100%)',
    iconBg: 'linear-gradient(135deg, #4DB6AC, #00897B)',
    icon: '🌲',
    emojis: ['🏔', '❄️', '🌄', '🦅', '☁️', '⭐', '🌙', '🗻'],
    color: '#00695C',
    lionMood: 'happy' as const,
  },
  'mountain-complete': {
    title: 'Mountain Conquered!',
    subtitle: 'Only the Dragon\'s Peak remains...',
    nextZone: 'Next up: Dragon\'s Peak — fiendish questions!',
    bg: 'linear-gradient(160deg, #d1c4e9 0%, #b39ddb 40%, #9575cd 100%)',
    iconBg: 'linear-gradient(135deg, #7E57C2, #5E35B1)',
    icon: '🏔',
    emojis: ['🐉', '🔥', '⚡', '💀', '🌋', '⭐', '💎', '🗡'],
    color: '#4527A0',
    lionMood: 'excited' as const,
  },
  'dragon-complete': {
    title: 'Dragon Defeated!',
    subtitle: 'The summit is yours!',
    nextZone: '',
    bg: 'linear-gradient(160deg, #ffcdd2 0%, #ef9a9a 40%, #e57373 100%)',
    iconBg: 'linear-gradient(135deg, #E53935, #C62828)',
    icon: '🐉',
    emojis: ['🎉', '🔥', '🐉', '💎', '👑', '⚔️', '🏆', '✨'],
    color: '#B71C1C',
    lionMood: 'excited' as const,
  },
  summit: {
    title: 'Summit Reached!',
    subtitle: 'You conquered Wonder Trail!',
    nextZone: '',
    bg: 'linear-gradient(160deg, #fff9c4 0%, #ffe082 30%, #ffb74d 60%, #ff8a65 100%)',
    iconBg: 'linear-gradient(135deg, #FFD54F, #FFA000)',
    icon: '🏆',
    emojis: ['🎉', '🎊', '✨', '🌟', '💫', '👑', '🌈', '🎆', '💐', '🦁'],
    color: '#E65100',
    lionMood: 'excited' as const,
  },
};

export function ZoneCelebration({ zone, onDone }: ZoneCelebrationProps) {
  const data = ZONE_DATA[zone];
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');
  const isSummit = zone === 'summit';

  useEffect(() => {
    // Enter animation
    const t1 = setTimeout(() => setPhase('show'), 100);
    // Start exit
    const t2 = setTimeout(() => setPhase('exit'), isSummit ? 4500 : 3000);
    // Call onDone
    const t3 = setTimeout(onDone, isSummit ? 5000 : 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [zone, onDone, isSummit]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: data.bg,
      opacity: phase === 'enter' ? 0 : phase === 'exit' ? 0 : 1,
      transition: 'opacity 0.5s ease',
      overflow: 'hidden',
    }}>
      {/* Confetti for summit */}
      {isSummit && <Confetti active={phase === 'show'} />}

      {/* Scattered emojis — gently floating in background */}
      {data.emojis.map((e, i) => {
        // Distribute in a pleasing pattern
        const angle = (i / data.emojis.length) * Math.PI * 2;
        const radius = 30 + (i % 3) * 12;
        const cx = 50 + Math.cos(angle) * radius;
        const cy = 50 + Math.sin(angle) * radius;
        return (
          <span key={i} style={{
            position: 'absolute',
            left: `${cx}%`,
            top: `${cy}%`,
            fontSize: `${isSummit ? 2.2 : 1.8}rem`,
            opacity: phase === 'show' ? 0.6 : 0,
            transition: `opacity 0.8s ease ${i * 0.08}s, transform 1s ease ${i * 0.08}s`,
            transform: phase === 'show' ? 'scale(1) translateY(0)' : 'scale(0.3) translateY(20px)',
            animation: phase === 'show' ? `gentleFloat ${3 + (i % 3)}s ease-in-out infinite ${i * 0.2}s` : 'none',
          }}>
            {e}
          </span>
        );
      })}

      {/* Central content card */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        padding: '32px 40px',
        borderRadius: 28,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        transform: phase === 'show' ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(30px)',
        opacity: phase === 'show' ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        maxWidth: 340,
        textAlign: 'center',
        zIndex: 10,
      }}>
        {/* Big zone icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          background: data.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          boxShadow: `0 8px 24px ${data.color}30`,
          transform: phase === 'show' ? 'scale(1)' : 'scale(0)',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
        }}>
          {data.icon}
        </div>

        {/* Lion */}
        <div style={{
          transform: phase === 'show' ? 'scale(1)' : 'scale(0)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s',
        }}>
          <LionMascot mood={data.lionMood} size={56} />
        </div>

        {/* Title */}
        <h2 style={{
          margin: 0,
          fontSize: isSummit ? '1.8rem' : '1.5rem',
          fontWeight: 800,
          color: data.color,
          letterSpacing: '-0.5px',
        }}>
          {data.title}
        </h2>

        {/* Subtitle */}
        <p style={{
          margin: 0,
          fontSize: '1rem',
          color: '#5D4E37',
          fontWeight: 500,
        }}>
          {data.subtitle}
        </p>

        {/* Next zone teaser */}
        {data.nextZone && (
          <div style={{
            marginTop: 4,
            padding: '8px 16px',
            borderRadius: 16,
            background: `${data.color}12`,
            border: `1.5px solid ${data.color}30`,
            fontSize: '0.82rem',
            fontWeight: 600,
            color: data.color,
          }}>
            {data.nextZone}
          </div>
        )}

        {/* Rainbow bar at bottom of card */}
        <div style={{
          width: '100%',
          height: 4,
          borderRadius: 2,
          background: 'linear-gradient(90deg, #E74C3C, #E67E22, #F5B041, #27AE60, #3498DB, #9B59B6)',
          marginTop: 4,
          opacity: 0.6,
        }} />
      </div>

      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: scale(1) translateY(0) rotate(0deg); }
          50% { transform: scale(1.05) translateY(-12px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
