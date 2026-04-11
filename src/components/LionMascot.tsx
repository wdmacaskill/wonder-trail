interface LionMascotProps {
  mood: 'neutral' | 'happy' | 'excited' | 'sad' | 'thinking';
  size?: number;
}

export function LionMascot({ mood, size = 64 }: LionMascotProps) {
  // Happier default expression, bouncier animations
  const bounce = mood === 'happy' || mood === 'excited';

  return (
    <div style={{
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.7,
      position: 'relative',
      transition: 'transform 0.3s ease',
      transform: mood === 'excited' ? 'scale(1.2)' : mood === 'sad' ? 'scale(0.92)' : 'scale(1)',
      animation: bounce ? 'lionBounce 0.6s ease' : undefined,
      filter: mood === 'sad' ? 'saturate(0.6)' : 'saturate(1.1)',
    }}>
      <span role="img" aria-label="lion" style={{ lineHeight: 1 }}>🦁</span>
      {/* Sparkles when happy/excited */}
      {(mood === 'happy' || mood === 'excited') && (
        <>
          <span style={{ position: 'absolute', top: -4, right: -4, fontSize: size * 0.25, animation: 'sparkle 1s infinite' }}>✨</span>
          <span style={{ position: 'absolute', bottom: -2, left: -4, fontSize: size * 0.2, animation: 'sparkle 1.3s infinite 0.3s' }}>⭐</span>
        </>
      )}
      {mood === 'excited' && (
        <span style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', fontSize: size * 0.3, animation: 'sparkle 0.8s infinite 0.1s' }}>🎉</span>
      )}
      {mood === 'sad' && (
        <span style={{ position: 'absolute', bottom: -4, right: 0, fontSize: size * 0.25 }}>💧</span>
      )}
      <style>{`
        @keyframes lionBounce {
          0% { transform: scale(1) translateY(0); }
          30% { transform: scale(1.15) translateY(-8px); }
          50% { transform: scale(1) translateY(0); }
          70% { transform: scale(1.05) translateY(-3px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}
