import type { GameSession } from '../types';
import { colors } from '../styles/theme';

interface AchievementsProps {
  session: GameSession;
  onBack: () => void;
}

export function Achievements({ session, onBack }: AchievementsProps) {
  const earned = session.badges.filter(b => b.earned);
  const unearned = session.badges.filter(b => !b.earned);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      padding: 20,
      maxWidth: 500,
      margin: '0 auto',
      width: '100%',
    }}>
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          color: colors.brown,
          fontSize: '0.9rem',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        ← Back
      </button>

      <h2 style={{ color: colors.darkBrown, margin: 0, textAlign: 'center' }}>🏆 Achievements</h2>

      {/* Overall stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 10,
      }}>
        {[
          { label: 'Total Stars', value: session.totalStars, icon: '⭐' },
          { label: 'Questions', value: session.totalQuestionsAnswered, icon: '❓' },
          { label: 'Correct', value: `${session.totalCorrect}/${session.totalQuestionsAnswered}`, icon: '✅' },
          { label: 'Rounds', value: session.roundsCompleted, icon: '🎮' },
          { label: 'Best Streak', value: session.longestStreak, icon: '🔥' },
          { label: 'Badges', value: `${earned.length}/${session.badges.length}`, icon: '🏅' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: colors.lightGold,
            borderRadius: 14,
            padding: '12px',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '1.2rem' }}>{stat.icon}</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: colors.darkBrown }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: colors.brown }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Earned badges */}
      {earned.length > 0 && (
        <>
          <h3 style={{ color: colors.darkBrown, margin: 0, fontSize: '1rem' }}>Earned</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {earned.map(badge => (
              <div key={badge.id} style={{
                background: '#fff',
                borderRadius: 14,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <span style={{ fontSize: '1.6rem' }}>{badge.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: colors.darkBrown, fontSize: '0.95rem' }}>{badge.name}</div>
                  <div style={{ fontSize: '0.8rem', color: colors.brown }}>{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Locked badges */}
      {unearned.length > 0 && (
        <>
          <h3 style={{ color: colors.brown, margin: 0, fontSize: '1rem' }}>Locked</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {unearned.map(badge => (
              <div key={badge.id} style={{
                background: '#f5f5f5',
                borderRadius: 14,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: 0.6,
              }}>
                <span style={{ fontSize: '1.6rem', filter: 'grayscale(1)' }}>{badge.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#999', fontSize: '0.95rem' }}>{badge.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
