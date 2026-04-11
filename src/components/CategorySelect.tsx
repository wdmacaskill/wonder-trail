import { useState } from 'react';
import { type Category, CATEGORY_LABELS, CATEGORY_EMOJI } from '../types';
import { colors } from '../styles/theme';

const ALL_CATEGORIES: Category[] = ['space', 'biology', 'brain', 'physics', 'history', 'human-nature', 'maths', 'cs-ai', 'economics', 'philosophy', 'ai-technical', 'ai-alignment', 'ai-governance', 'us-government'];

interface CategorySelectProps {
  onStart: (categories: Category[]) => void;
}

export function CategorySelect({ onStart }: CategorySelectProps) {
  const [selected, setSelected] = useState<Set<Category>>(new Set());

  const toggle = (cat: Category) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
      padding: '20px',
      maxWidth: 500,
      margin: '0 auto',
    }}>
      <h2 style={{ color: colors.darkBrown, margin: 0, fontSize: '1.5rem' }}>Choose Your Categories</h2>
      <p style={{ color: colors.brown, margin: 0, fontSize: '0.9rem', textAlign: 'center' }}>
        Pick which topics to explore this round
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
        width: '100%',
      }}>
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            style={{
              padding: '14px 12px',
              borderRadius: 14,
              border: `2px solid ${selected.has(cat) ? colors.orange : '#ddd'}`,
              background: selected.has(cat) ? colors.lightGold : '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.95rem',
              fontWeight: selected.has(cat) ? 600 : 400,
              color: colors.darkBrown,
              transition: 'all 0.2s ease',
              boxShadow: selected.has(cat) ? '0 2px 8px rgba(245, 176, 65, 0.3)' : 'none',
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>{CATEGORY_EMOJI[cat]}</span>
            <span>{CATEGORY_LABELS[cat]}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => selected.size > 0 && onStart(Array.from(selected))}
        disabled={selected.size === 0}
        style={{
          marginTop: 8,
          padding: '14px 40px',
          borderRadius: 30,
          border: 'none',
          background: selected.size > 0 ? `linear-gradient(135deg, ${colors.gold}, ${colors.orange})` : '#ddd',
          color: selected.size > 0 ? '#fff' : '#999',
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: selected.size > 0 ? 'pointer' : 'default',
          boxShadow: selected.size > 0 ? '0 4px 15px rgba(230, 126, 34, 0.4)' : 'none',
          transition: 'all 0.2s ease',
        }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Start Round 🌟
      </button>
    </div>
  );
}
