import type { RoundState, Badge, Category } from '../types';
import { CATEGORY_LABELS, CATEGORY_EMOJI } from '../types';
import { colors } from '../styles/theme';
import { Confetti } from './Confetti';
import { LionMascot } from './LionMascot';

interface RoundCompleteProps {
  round: RoundState;
  newBadges: Badge[];
  onFinish: () => void;
}

export function RoundComplete({ round, newBadges, onFinish }: RoundCompleteProps) {
  const totalQuestions = round.answers.length;
  const correctCount = round.answers.filter(a => a.correct).length;
  const isPerfect = correctCount === totalQuestions;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Compute per-category stats
  const categoryStats: Record<string, { correct: number; total: number }> = {};
  for (let i = 0; i < round.questions.length && i < round.answers.length; i++) {
    const q = round.questions[i];
    const a = round.answers[i];
    if (!a) continue;
    const cat = q.category;
    if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
    categoryStats[cat].total++;
    if (a.correct) categoryStats[cat].correct++;
  }

  // Sort by percentage (worst first for "areas to improve")
  const catEntries = Object.entries(categoryStats)
    .map(([cat, stats]) => ({
      cat: cat as Category,
      ...stats,
      pct: Math.round((stats.correct / stats.total) * 100),
    }))
    .sort((a, b) => a.pct - b.pct);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
      padding: 24,
      maxWidth: 500,
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <Confetti active={true} />

      <LionMascot mood={isPerfect ? 'excited' : percentage >= 60 ? 'happy' : 'neutral'} size={80} />

      <h2 style={{
        color: colors.darkBrown,
        margin: 0,
        fontSize: '1.6rem',
        background: colors.rainbow,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {isPerfect ? 'Perfect Round! 🌟' : percentage >= 80 ? 'Amazing! 🎉' : percentage >= 60 ? 'Well Done! 👏' : 'Good Try! 💪'}
      </h2>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        width: '100%',
      }}>
        {[
          { label: 'Correct', value: `${correctCount}/${totalQuestions}`, icon: '✅' },
          { label: 'Stars', value: `${round.stars}`, icon: '⭐' },
          { label: 'Best Streak', value: `${round.maxStreak}`, icon: '🔥' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: colors.lightGold,
            borderRadius: 14,
            padding: '14px 8px',
          }}>
            <div style={{ fontSize: '1.4rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: colors.darkBrown }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: colors.brown, fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {catEntries.length > 1 && (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 16,
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{ color: colors.darkBrown, margin: '0 0 12px', fontSize: '1rem' }}>
            📊 Category Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {catEntries.map(({ cat, correct, total, pct }) => (
              <div key={cat} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <span style={{ fontSize: '1.1rem', width: 28, textAlign: 'center' }}>
                  {CATEGORY_EMOJI[cat] ?? '❓'}
                </span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.darkBrown }}>
                    {CATEGORY_LABELS[cat] ?? cat}
                  </div>
                  <div style={{
                    height: 6,
                    borderRadius: 3,
                    background: '#eee',
                    overflow: 'hidden',
                    marginTop: 3,
                  }}>
                    <div style={{
                      height: '100%',
                      borderRadius: 3,
                      width: `${pct}%`,
                      background: pct === 100 ? colors.green
                        : pct >= 70 ? '#81C784'
                        : pct >= 40 ? colors.orange
                        : colors.red,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: pct === 100 ? colors.green : pct >= 70 ? '#4CAF50' : pct >= 40 ? colors.orange : colors.red,
                  minWidth: 50,
                  textAlign: 'right',
                }}>
                  {correct}/{total} ({pct}%)
                </span>
              </div>
            ))}
          </div>
          {catEntries[0].pct < 50 && (
            <p style={{ fontSize: '0.8rem', color: colors.brown, margin: '10px 0 0', textAlign: 'left' }}>
              💡 Tip: Try focusing on {CATEGORY_LABELS[catEntries[0].cat]} next round!
            </p>
          )}
        </div>
      )}

      {/* New badges */}
      {newBadges.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 16,
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{ color: colors.darkBrown, margin: '0 0 12px', fontSize: '1rem' }}>
            🏆 New Badges Earned!
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {newBadges.map(badge => (
              <div key={badge.id} style={{
                background: colors.lightGold,
                borderRadius: 12,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                animation: 'fadeIn 0.5s ease',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{badge.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: colors.darkBrown }}>{badge.name}</div>
                  <div style={{ fontSize: '0.7rem', color: colors.brown }}>{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onFinish}
        style={{
          padding: '14px 40px',
          borderRadius: 30,
          border: 'none',
          background: `linear-gradient(135deg, ${colors.gold}, ${colors.orange})`,
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(230, 126, 34, 0.4)',
          marginTop: 8,
        }}
      >
        Back to Home 🦁
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
