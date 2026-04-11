import { useState } from 'react';
import { colors } from '../styles/theme';

const PIN = '1234'; // Change this to your desired PIN

interface PinGateProps {
  onVerified: () => void;
}

export function PinGate({ onVerified }: PinGateProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (input === PIN) {
      onVerified();
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 20,
      background: `linear-gradient(135deg, ${colors.cream}, ${colors.lightGold})`,
    }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>🦁</div>
      <h1 style={{
        color: colors.darkBrown,
        fontSize: '1.8rem',
        margin: '0 0 8px',
      }}>
        Wonder Trail
      </h1>
      <p style={{ color: colors.brown, margin: '0 0 24px', fontSize: '0.9rem' }}>
        Enter PIN to play
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={6}
          value={input}
          onChange={e => setInput(e.target.value.replace(/\D/g, ''))}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e); }}
          placeholder="• • • •"
          autoFocus
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          style={{
            padding: '12px 20px',
            borderRadius: 14,
            border: `2px solid ${error ? colors.red : colors.lightOrange}`,
            fontSize: '1.2rem',
            textAlign: 'center',
            width: 120,
            letterSpacing: 6,
            transition: 'border-color 0.3s ease',
            WebkitTextSecurity: 'disc',
          } as React.CSSProperties}
        />
        <button onClick={handleSubmit} style={{
          padding: '12px 24px',
          borderRadius: 14,
          border: 'none',
          background: `linear-gradient(135deg, ${colors.gold}, ${colors.orange})`,
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '1rem',
        }}>
          Go
        </button>
      </div>
      {error && (
        <p style={{ color: colors.red, margin: '12px 0 0', fontSize: '0.85rem' }}>
          Wrong PIN — try again!
        </p>
      )}
    </div>
  );
}
