import { colors } from '../styles/theme';
import { LionMascot } from './LionMascot';
import { SPECIAL_SPACES } from '../utils/questionPicker';

interface GameBoardProps {
  position: number;
  goal: number;
  streak: number;
  stars: number;
  onContinue: () => void;
  mood: 'neutral' | 'happy' | 'excited' | 'sad';
}

// Board zones: 6 easy + 6 medium + 6 hard + 2 fiendish
const ZONES = [
  { name: 'Sunny Meadow', end: 5, bg: '#E8F5E9', accent: '#4CAF50', emoji: '🌻', difficulty: 'Easy', deco: ['🌻', '🌼', '🌷', '🌸', '🐝'] },
  { name: 'Deep Forest', end: 11, bg: '#E0F2F1', accent: '#009688', emoji: '🌲', difficulty: 'Medium', deco: ['🌲', '🍂', '🦉', '🍄', '🌳'] },
  { name: 'Mountain Pass', end: 17, bg: '#EDE7F6', accent: '#7E57C2', emoji: '🏔', difficulty: 'Hard', deco: ['🏔', '🦅', '❄️', '☁️', '🗻'] },
  { name: 'Dragon\'s Peak', end: 19, bg: '#FCE4EC', accent: '#C62828', emoji: '🐉', difficulty: 'Fiendish', deco: ['🐉', '🔥', '💀', '⚡'] },
  { name: 'Summit', end: 20, bg: '#FFF9C4', accent: '#FFC107', emoji: '🏆', difficulty: '', deco: ['🏆', '👑', '🌟'] },
];

function getZone(pos: number) {
  for (const z of ZONES) {
    if (pos <= z.end) return z;
  }
  return ZONES[ZONES.length - 1];
}

// Generate a smooth winding path
function getSpaceCoords(index: number, total: number, width: number) {
  // Vertical position: bottom to top
  const y = (1 - index / total) * 100;
  // Gentle sine wave for winding
  const amplitude = width * 0.25;
  const centerX = width / 2;
  const x = centerX + Math.sin(index * 0.8) * amplitude;
  return { x, y };
}

export function GameBoard({ position, goal, streak, stars, onContinue, mood }: GameBoardProps) {
  const currentZone = getZone(position);
  const boardWidth = 320;
  const boardHeight = 520;
  const spaces = Array.from({ length: goal + 1 }, (_, i) => i);

  // Compute coords for all spaces
  const coords = spaces.map(i => {
    const t = i / goal;
    const y = boardHeight - 30 - t * (boardHeight - 60); // bottom to top with padding
    const x = boardWidth / 2 + Math.sin(i * 0.75) * (boardWidth * 0.28);
    return { x, y };
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      width: '100%',
      maxWidth: 420,
      margin: '0 auto',
    }}>
      {/* Stats bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '10px 16px',
        background: colors.lightGold,
        borderRadius: 14,
        fontSize: '0.85rem',
        color: colors.darkBrown,
        fontWeight: 600,
      }}>
        <span>⭐ {stars}</span>
        <span>🔥 {streak} streak</span>
        <span>📍 {position}/{goal}</span>
      </div>

      {/* Zone label */}
      <div style={{
        padding: '6px 16px',
        borderRadius: 20,
        background: currentZone.accent + '20',
        border: `2px solid ${currentZone.accent}`,
        fontSize: '0.85rem',
        fontWeight: 700,
        color: currentZone.accent,
      }}>
        {currentZone.emoji} {currentZone.name} {currentZone.difficulty && `(${currentZone.difficulty})`}
      </div>

      {/* Board */}
      <div style={{
        width: boardWidth,
        height: boardHeight,
        borderRadius: 20,
        position: 'relative',
        overflow: 'visible',
      }}>
        {/* Zone backgrounds */}
        {ZONES.map((zone, zi) => {
          const prevEnd = zi > 0 ? ZONES[zi - 1].end : -1;
          const startIdx = prevEnd + 1;
          const topY = coords[Math.min(zone.end, goal)]?.y ?? 0;
          const bottomY = coords[startIdx]?.y ?? boardHeight;
          return (
            <div key={zone.name} style={{
              position: 'absolute',
              left: 0, right: 0,
              top: topY - 15,
              height: bottomY - topY + 30,
              background: zone.bg,
              borderRadius: zi === 0 ? '0 0 20px 20px' : zi === ZONES.length - 1 ? '20px 20px 0 0' : 0,
            }}>
              {/* Decorative emojis */}
              {zone.deco.map((emoji, di) => (
                <span key={di} style={{
                  position: 'absolute',
                  left: `${8 + (di * 21) % 84}%`,
                  top: `${10 + (di * 29) % 70}%`,
                  fontSize: '12px',
                  opacity: 0.3,
                }}>{emoji}</span>
              ))}
            </div>
          );
        })}

        {/* SVG path connecting dots */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          {coords.slice(0, -1).map((from, i) => {
            const to = coords[i + 1];
            const isPast = i < position;
            const zone = getZone(i);
            return (
              <line
                key={i}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke={isPast ? zone.accent : '#ccc'}
                strokeWidth={isPast ? 3 : 2}
                strokeDasharray={isPast ? 'none' : '4,4'}
                opacity={isPast ? 0.7 : 0.4}
              />
            );
          })}
        </svg>

        {/* Space dots */}
        {coords.map((c, i) => {
          const isLion = i === position;
          const isPast = i < position;
          const isGoal = i === goal;
          const isSpecial = SPECIAL_SPACES.includes(i);
          const zone = getZone(i);
          const size = isSpecial ? 34 : isGoal ? 32 : 20;

          return (
            <div key={i} style={{
              position: 'absolute',
              left: c.x - size / 2,
              top: c.y - size / 2,
              width: size,
              height: size,
              borderRadius: isSpecial ? 8 : '50%',
              background: isGoal ? `linear-gradient(135deg, ${colors.gold}, ${colors.orange})`
                : isSpecial ? (isPast ? '#fff' : `linear-gradient(135deg, ${zone.accent}, ${zone.accent}cc)`)
                : isPast ? zone.accent + '50' : '#fff',
              border: `2px solid ${isGoal ? colors.orange : isSpecial ? zone.accent : isPast ? zone.accent + '80' : '#ddd'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isSpecial || isGoal ? '13px' : '8px',
              fontWeight: 700,
              color: isSpecial && !isPast ? '#fff' : colors.darkBrown,
              zIndex: isLion ? 20 : 2,
              transition: 'all 0.4s ease',
              boxShadow: isSpecial ? `0 2px 8px ${zone.accent}40` : isLion ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
            }}>
              {isGoal ? '🏆' : isSpecial ? '🌉' : ''}

              {/* Lion */}
              {isLion && (
                <div style={{
                  position: 'absolute',
                  top: -28,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 30,
                }}>
                  <LionMascot mood={mood} size={46} />
                </div>
              )}
            </div>
          );
        })}

        {/* Bridge labels */}
        {SPECIAL_SPACES.map(sp => {
          const c = coords[sp];
          if (!c) return null;
          const zone = getZone(sp);
          const label = sp === 6 ? '🌲 Forest Gate' : sp === 12 ? '🏔 Mountain Gate' : '🐉 Dragon Gate';
          // Place label on the opposite side of the path from the dot
          const labelLeft = c.x > boardWidth / 2;
          return (
            <div key={sp} style={{
              position: 'absolute',
              top: c.y - 8,
              left: labelLeft ? c.x - 110 : c.x + 24,
              fontSize: '0.65rem',
              fontWeight: 700,
              color: zone.accent,
              whiteSpace: 'nowrap',
              zIndex: 5,
              background: zone.bg + 'cc',
              padding: '2px 6px',
              borderRadius: 6,
            }}>
              {label}
            </div>
          );
        })}
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        style={{
          padding: '14px 36px',
          borderRadius: 30,
          border: 'none',
          background: `linear-gradient(135deg, ${colors.gold}, ${colors.orange})`,
          color: '#fff',
          fontSize: '1.05rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(230, 126, 34, 0.4)',
        }}
      >
        {SPECIAL_SPACES.includes(position) ? 'Cross the Bridge 🌉' : 'Next Question →'}
      </button>
    </div>
  );
}
