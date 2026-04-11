import { useState } from 'react';
import type { Category, Difficulty } from '../types';
import { CATEGORY_LABELS, CATEGORY_EMOJI } from '../types';
import { colors } from '../styles/theme';

const DIFFICULTY_LABELS: Record<Difficulty, { label: string; color: string }> = {
  easy: { label: 'Easy', color: colors.green },
  medium: { label: 'Medium', color: colors.orange },
  hard: { label: 'Hard', color: colors.red },
  fiendish: { label: 'Fiendish', color: '#7B1FA2' },
};

interface WagerPickerProps {
  category: Category;
  difficulty: Difficulty;
  onWager: (amount: number) => void;
  onSkip: () => void;
}

export function WagerPicker({ category, difficulty, onWager, onSkip }: WagerPickerProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const diffInfo = DIFFICULTY_LABELS[difficulty];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: 20,
      width: '100%',
      maxWidth: 400,
      margin: '0 auto',
    }}>
      {/* Category & difficulty preview */}
      <div style={{
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <span style={{
          padding: '6px 14px',
          borderRadius: 20,
          background: colors.lightGold,
          fontSize: '0.9rem',
          fontWeight: 600,
          color: colors.darkBrown,
        }}>
          {CATEGORY_EMOJI[category]} {CATEGORY_LABELS[category]}
        </span>
        <span style={{
          padding: '6px 14px',
          borderRadius: 20,
          background: `${diffInfo.color}18`,
          border: `2px solid ${diffInfo.color}`,
          fontSize: '0.85rem',
          fontWeight: 700,
          color: diffInfo.color,
        }}>
          {diffInfo.label}
        </span>
      </div>

      <h3 style={{ color: colors.darkBrown, margin: 0, fontSize: '1.2rem' }}>
        How confident are you?
      </h3>
      <p style={{ color: colors.brown, margin: 0, fontSize: '0.85rem', textAlign: 'center' }}>
        Wager stars for bonus movement — but you'll go back further if wrong!
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        {[1, 2, 3].map(amount => (
          <button
            key={amount}
            onClick={() => setSelected(amount)}
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              border: `3px solid ${selected === amount ? colors.orange : '#ddd'}`,
              background: selected === amount ? colors.lightGold : '#fff',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              fontSize: '0.85rem',
              fontWeight: 600,
              color: colors.darkBrown,
              transition: 'all 0.2s ease',
              transform: selected === amount ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>{'⭐'.repeat(amount)}</span>
            <span>{amount === 1 ? 'A bit' : amount === 2 ? 'Pretty' : 'Very'}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onSkip}
          style={{
            padding: '10px 24px',
            borderRadius: 20,
            border: `2px solid #ddd`,
            background: '#fff',
            color: colors.brown,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Skip wager
        </button>
        {selected && (
          <button
            onClick={() => onWager(selected)}
            style={{
              padding: '10px 24px',
              borderRadius: 20,
              border: 'none',
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.orange})`,
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(230, 126, 34, 0.3)',
            }}
          >
            Wager {selected} {'⭐'.repeat(selected)}
          </button>
        )}
      </div>
    </div>
  );
}
