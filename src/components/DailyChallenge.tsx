import { useState, useMemo } from 'react';
import type { Question, GameSession } from '../types';
import { colors } from '../styles/theme';
import { QuestionCard } from './QuestionCard';
import { Confetti } from './Confetti';
import { LionMascot } from './LionMascot';
import questionsData from '../data/questions.json';

interface DailyChallengeProps {
  session: GameSession;
  onSaveResult: (date: string, score: number, total: number) => void;
  onBack: () => void;
}

/** Deterministic shuffle using a seed (date string) */
function seededShuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  for (let i = result.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash + i) | 0;
    const j = Math.abs(hash) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DailyChallenge({ session, onSaveResult, onBack }: DailyChallengeProps) {
  const today = getTodayString();

  // Check if already completed today
  const previousResult = session.dailyChallenges?.[today];

  const questions = useMemo(() => {
    const all = questionsData.standard as Question[];
    const shuffled = seededShuffle(all, today);
    // Pick 10: 3 easy, 4 medium, 3 hard
    const easy = shuffled.filter(q => q.difficulty === 'easy').slice(0, 3);
    const medium = shuffled.filter(q => q.difficulty === 'medium').slice(0, 4);
    const hard = shuffled.filter(q => q.difficulty === 'hard').slice(0, 3);
    return [...easy, ...medium, ...hard];
  }, [today]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(!!previousResult);
  const [started, setStarted] = useState(false);

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore(s => s + 1);
    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      const finalScore = score + (correct ? 1 : 0);
      setFinished(true);
      onSaveResult(today, finalScore, questions.length);
    } else {
      setCurrentIdx(nextIdx);
    }
  };

  // Not started yet — show intro
  if (!started && !previousResult) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 24,
        gap: 20,
        background: `linear-gradient(180deg, ${colors.cream}, ${colors.warmWhite})`,
      }}>
        <button onClick={onBack} style={{
          position: 'absolute', top: 16, left: 16,
          background: 'none', border: 'none', color: colors.brown,
          fontSize: '0.9rem', cursor: 'pointer',
        }}>← Back</button>

        <LionMascot mood="excited" size={80} />
        <h2 style={{ color: colors.darkBrown, margin: 0, fontSize: '1.5rem' }}>Daily Challenge</h2>
        <p style={{ color: colors.brown, margin: 0, fontSize: '0.9rem', textAlign: 'center', maxWidth: 300 }}>
          10 questions, same for everyone today. No wagers, no going back. How well can you do?
        </p>
        <div style={{
          background: colors.lightGold,
          borderRadius: 14,
          padding: '12px 20px',
          fontSize: '0.85rem',
          color: colors.darkBrown,
          fontWeight: 600,
        }}>
          📅 {today}
        </div>
        <button
          onClick={() => setStarted(true)}
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
          }}
        >
          Start Challenge! 🔥
        </button>
      </div>
    );
  }

  // Finished (either just now or previously)
  if (finished) {
    const displayScore = previousResult ? previousResult.score : score;
    const displayTotal = previousResult ? previousResult.total : questions.length;
    const pct = Math.round((displayScore / displayTotal) * 100);

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 24,
        gap: 20,
        background: `linear-gradient(180deg, ${colors.cream}, ${colors.warmWhite})`,
        textAlign: 'center',
      }}>
        <Confetti active={!previousResult} />
        <LionMascot mood={pct >= 80 ? 'excited' : pct >= 50 ? 'happy' : 'neutral'} size={80} />
        <h2 style={{ color: colors.darkBrown, margin: 0 }}>
          {previousResult ? "Today's Challenge" : 'Challenge Complete!'}
        </h2>
        <div style={{
          fontSize: '3rem',
          fontWeight: 800,
          background: colors.rainbow,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {displayScore}/{displayTotal}
        </div>
        <p style={{ color: colors.brown, fontSize: '0.9rem' }}>
          {previousResult ? 'You already completed today\'s challenge!' : pct === 100 ? 'Perfect! 🌟' : pct >= 80 ? 'Excellent!' : pct >= 50 ? 'Good effort!' : 'Keep learning!'}
        </p>
        <button
          onClick={onBack}
          style={{
            padding: '14px 40px',
            borderRadius: 30,
            border: 'none',
            background: `linear-gradient(135deg, ${colors.gold}, ${colors.orange})`,
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Back to Home 🦁
        </button>
      </div>
    );
  }

  // Active challenge
  const q = questions[currentIdx];
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${colors.cream}, ${colors.warmWhite})` }}>
      <div style={{
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: colors.darkBrown,
      }}>
        <span>📅 Daily Challenge</span>
        <span>Q{currentIdx + 1}/{questions.length}</span>
        <span>✅ {score}/{currentIdx}</span>
      </div>
      {/* Progress bar */}
      <div style={{ height: 4, background: '#eee', margin: '0 20px', borderRadius: 2 }}>
        <div style={{
          height: '100%',
          width: `${(currentIdx / questions.length) * 100}%`,
          background: colors.rainbow,
          borderRadius: 2,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <QuestionCard
        key={q.id}
        question={q}
        wagered={0}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
