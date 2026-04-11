import type { GameSession } from '../types';
import { colors } from '../styles/theme';
import { LionMascot } from './LionMascot';

interface HomeScreenProps {
  session: GameSession;
  onNewRound: () => void;
  onAchievements: () => void;
  onDailyChallenge: () => void;
}

export function HomeScreen({ session, onNewRound, onAchievements, onDailyChallenge }: HomeScreenProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 24,
      gap: 24,
      background: `linear-gradient(180deg, ${colors.cream}, ${colors.warmWhite})`,
    }}>
      {/* Decorative flowers */}
      <div style={{ position: 'fixed', top: 20, left: 20, fontSize: '1.5rem', opacity: 0.3 }}>🌸</div>
      <div style={{ position: 'fixed', top: 60, right: 30, fontSize: '1.2rem', opacity: 0.3 }}>🌻</div>
      <div style={{ position: 'fixed', bottom: 40, left: 40, fontSize: '1.4rem', opacity: 0.3 }}>🌷</div>
      <div style={{ position: 'fixed', bottom: 80, right: 20, fontSize: '1.3rem', opacity: 0.3 }}>🌺</div>

      {/* Title */}
      <LionMascot mood={session.roundsCompleted > 0 ? 'happy' : 'neutral'} size={90} />

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.2rem',
          margin: 0,
          background: colors.rainbow,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
        }}>
          Wonder Trail
        </h1>
        <p style={{ color: colors.brown, margin: '6px 0 0', fontSize: '0.95rem' }}>
          A trivia adventure for curious minds 🌿
        </p>
      </div>

      {/* Quick stats */}
      {session.roundsCompleted > 0 && (
        <div style={{
          display: 'flex',
          gap: 16,
          padding: '12px 20px',
          background: colors.lightGold,
          borderRadius: 16,
          fontSize: '0.85rem',
          color: colors.darkBrown,
          fontWeight: 600,
        }}>
          <span>⭐ {session.totalStars}</span>
          <span>🎮 {session.roundsCompleted} rounds</span>
          <span>🔥 {session.longestStreak} best streak</span>
        </div>
      )}

      {/* Main buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
        <button
          onClick={onNewRound}
          style={{
            padding: '16px',
            borderRadius: 30,
            border: 'none',
            background: `linear-gradient(135deg, ${colors.gold}, ${colors.orange})`,
            color: '#fff',
            fontSize: '1.15rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(230, 126, 34, 0.4)',
            transition: 'transform 0.2s ease',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {session.roundsCompleted > 0 ? 'New Round 🌟' : 'Start Playing 🌟'}
        </button>
        <button
          onClick={onDailyChallenge}
          style={{
            padding: '14px',
            borderRadius: 30,
            border: `2px solid #3498DB`,
            background: '#fff',
            color: '#3498DB',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Daily Challenge 📅
        </button>
        <button
          onClick={onAchievements}
          style={{
            padding: '14px',
            borderRadius: 30,
            border: `2px solid ${colors.lightOrange}`,
            background: '#fff',
            color: colors.darkBrown,
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Achievements 🏆
        </button>
      </div>

      {/* Rainbow bar at bottom */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: colors.rainbow,
      }} />
    </div>
  );
}
