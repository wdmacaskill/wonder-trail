import { useState } from 'react';
import type { OddOneOutQuestion, EstimationQuestion, RiddleQuestion, SpecialQuestion } from '../types';
import { colors } from '../styles/theme';

interface SpecialRoundProps {
  question: SpecialQuestion;
  onComplete: (correct: boolean) => void;
}

export function SpecialRound({ question, onComplete }: SpecialRoundProps) {
  if (question.type === 'odd-one-out') {
    return <OddOneOut question={question} onComplete={onComplete} />;
  }
  if (question.type === 'riddle') {
    return <Riddle question={question} onComplete={onComplete} />;
  }
  return <Estimation question={question} onComplete={onComplete} />;
}

function OddOneOut({ question, onComplete }: { question: OddOneOutQuestion; onComplete: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleConfirm = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: 20,
      maxWidth: 500,
      margin: '0 auto',
      width: '100%',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
        borderRadius: 14,
        padding: '12px 16px',
        color: '#fff',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '0.95rem',
      }}>
        🎭 Special Round: Odd One Out!
      </div>
      <p style={{ color: colors.darkBrown, fontSize: '1.05rem', fontWeight: 600, textAlign: 'center', margin: 0 }}>
        {question.prompt}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {question.facts.map((fact, i) => {
          const isFake = i === question.fakeIndex;
          let bg = '#fff';
          let border = `2px solid ${selected === i ? colors.orange : '#eee'}`;
          let textColor = colors.darkBrown;

          if (revealed) {
            if (isFake) { bg = '#f8d7da'; border = `2px solid ${colors.red}`; textColor = '#721c24'; }
            else { bg = '#d4edda'; border = `2px solid ${colors.green}`; }
          } else if (selected === i) {
            bg = colors.lightGold;
          }

          return (
            <button
              key={i}
              onClick={() => !revealed && setSelected(i)}
              disabled={revealed}
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                cursor: revealed ? 'default' : 'pointer',
                fontSize: '0.9rem',
                textAlign: 'left',
                background: bg,
                border,
                color: textColor,
                transition: 'all 0.2s ease',
                fontWeight: 500,
              }}
            >
              {revealed && isFake ? '❌ ' : revealed ? '✅ ' : ''}
              {fact}
            </button>
          );
        })}
      </div>

      {!revealed && selected !== null && (
        <button onClick={handleConfirm} style={{
          padding: '14px 36px',
          borderRadius: 30,
          border: 'none',
          background: `linear-gradient(135deg, #9B59B6, #8E44AD)`,
          color: '#fff',
          fontSize: '1.05rem',
          fontWeight: 700,
          cursor: 'pointer',
          alignSelf: 'center',
        }}>
          That's the fake one!
        </button>
      )}

      {revealed && (
        <>
          <div style={{
            background: '#F3E5F5',
            borderRadius: 14,
            padding: 16,
            borderLeft: '4px solid #9B59B6',
            animation: 'fadeIn 0.4s ease',
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: colors.darkBrown, lineHeight: 1.6 }}>
              <strong>💡</strong> {question.explanation}
            </p>
          </div>
          <button
            onClick={() => onComplete(selected === question.fakeIndex)}
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
              alignSelf: 'center',
            }}
          >
            Continue →
          </button>
        </>
      )}
    </div>
  );
}

function Estimation({ question, onComplete }: { question: EstimationQuestion; onComplete: (correct: boolean) => void }) {
  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
  };

  const getSuccess = () => {
    const g = parseFloat(guess) || 0;
    const answer = question.answer;
    const low = question.rangeLow ?? answer * 0.5;
    const high = question.rangeHigh ?? answer * 2;
    return g >= low && g <= high;
  };

  const formatNumber = (n: number) => n.toLocaleString();
  const low = question.rangeLow ?? question.answer * 0.5;
  const high = question.rangeHigh ?? question.answer * 2;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: 20,
      maxWidth: 500,
      margin: '0 auto',
      width: '100%',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #3498DB, #2980B9)',
        borderRadius: 14,
        padding: '12px 16px',
        color: '#fff',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '0.95rem',
      }}>
        📊 Bridge Challenge: Estimation!
      </div>
      <p style={{ color: colors.darkBrown, fontSize: '1.05rem', fontWeight: 600, textAlign: 'center', margin: 0 }}>
        {question.question}
      </p>
      <p style={{ color: colors.brown, fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>
        How close can you get?
      </p>

      {!revealed && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <input
              type="number"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              placeholder="Your guess..."
              autoComplete="off"
              data-1p-ignore
              style={{
                width: '100%',
                maxWidth: 220,
                padding: '14px',
                borderRadius: 14,
                border: `2px solid ${colors.lightOrange}`,
                fontSize: '1.2rem',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            onClick={handleReveal}
            disabled={!guess}
            style={{
              padding: '14px 36px',
              borderRadius: 30,
              border: 'none',
              background: guess ? 'linear-gradient(135deg, #3498DB, #2980B9)' : '#ddd',
              color: '#fff',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: guess ? 'pointer' : 'default',
              alignSelf: 'center',
            }}
          >
            Reveal Answer!
          </button>
        </>
      )}

      {revealed && (
        <div style={{
          textAlign: 'center',
          animation: 'fadeIn 0.4s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: colors.orange,
            margin: '10px 0',
          }}>
            {formatNumber(question.answer)} {question.unit}
          </div>
          <div style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: getSuccess() ? '#d4edda' : '#f8d7da',
            color: getSuccess() ? '#155724' : '#721c24',
            fontSize: '0.9rem',
            fontWeight: 700,
          }}>
            {getSuccess()
              ? `🎉 Your guess of ${formatNumber(parseFloat(guess) || 0)} is within the acceptable range (${formatNumber(low)} – ${formatNumber(high)})!`
              : `😬 Your guess of ${formatNumber(parseFloat(guess) || 0)} was outside the acceptable range (${formatNumber(low)} – ${formatNumber(high)})`
            }
          </div>
          <div style={{
            background: '#D6EAF8',
            borderRadius: 14,
            padding: 16,
            borderLeft: '4px solid #3498DB',
            width: '100%',
            textAlign: 'left',
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: colors.darkBrown, lineHeight: 1.6 }}>
              <strong>💡</strong> {question.explanation}
            </p>
          </div>
          <button
            onClick={() => onComplete(getSuccess())}
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
            Continue →
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Riddle({ question, onComplete }: { question: RiddleQuestion; onComplete: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleConfirm = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: 20,
      maxWidth: 500,
      margin: '0 auto',
      width: '100%',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #E67E22, #D35400)',
        borderRadius: 14,
        padding: '12px 16px',
        color: '#fff',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '0.95rem',
      }}>
        🧩 Bridge Challenge: Riddle!
      </div>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        padding: 20,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        borderLeft: `4px solid #E67E22`,
        fontStyle: 'italic',
        fontSize: '1.1rem',
        fontWeight: 500,
        color: colors.darkBrown,
        lineHeight: 1.6,
        textAlign: 'center',
      }}>
        {question.riddle}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex;
          let bg = '#fff';
          let border = `2px solid ${selected === i ? colors.orange : '#eee'}`;
          let textColor = colors.darkBrown;

          if (revealed) {
            if (isCorrect) { bg = '#d4edda'; border = `2px solid ${colors.green}`; textColor = '#155724'; }
            else if (selected === i) { bg = '#f8d7da'; border = `2px solid ${colors.red}`; textColor = '#721c24'; }
            else { bg = '#fff'; border = '2px solid #eee'; textColor = '#999'; }
          } else if (selected === i) {
            bg = colors.lightGold;
          }

          return (
            <button
              key={i}
              onClick={() => !revealed && setSelected(i)}
              disabled={revealed}
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                cursor: revealed ? 'default' : 'pointer',
                fontSize: '0.95rem',
                fontWeight: 500,
                textAlign: 'left',
                background: bg,
                border,
                color: textColor,
                transition: 'all 0.2s ease',
              }}
            >
              {revealed && isCorrect ? '✅ ' : revealed && selected === i ? '❌ ' : ''}
              {option}
            </button>
          );
        })}
      </div>

      {!revealed && selected !== null && (
        <button onClick={handleConfirm} style={{
          padding: '14px 36px',
          borderRadius: 30,
          border: 'none',
          background: 'linear-gradient(135deg, #E67E22, #D35400)',
          color: '#fff',
          fontSize: '1.05rem',
          fontWeight: 700,
          cursor: 'pointer',
          alignSelf: 'center',
        }}>
          Lock in answer
        </button>
      )}

      {revealed && (
        <>
          <div style={{
            background: '#FFF3CD',
            borderRadius: 14,
            padding: 16,
            borderLeft: '4px solid #E67E22',
            animation: 'fadeIn 0.4s ease',
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: colors.darkBrown, lineHeight: 1.6 }}>
              <strong>💡</strong> {question.explanation}
            </p>
          </div>
          <button
            onClick={() => onComplete(selected === question.correctIndex)}
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
              alignSelf: 'center',
            }}
          >
            Continue →
          </button>
        </>
      )}
    </div>
  );
}
