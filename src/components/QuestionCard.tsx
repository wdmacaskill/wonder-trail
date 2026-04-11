import { useState } from 'react';
import type { Question } from '../types';
import { colors } from '../styles/theme';

interface QuestionCardProps {
  question: Question;
  wagered: number;
  onAnswer: (correct: boolean) => void;
  /** If provided, shows "Double or Nothing" button on wrong answers */
  onDoubleOrNothing?: () => void;
  /** Retire this question so it won't come back */
  onRetire?: (questionId: string) => void;
}

export function QuestionCard({ question, wagered, onAnswer, onDoubleOrNothing, onRetire }: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(false);

  const isCorrect = selected !== null && selected === question.correctIndex;

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelected(index);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  const handleContinue = () => {
    onAnswer(selected === question.correctIndex);
  };

  const getOptionStyle = (index: number) => {
    const isSelected = selected === index;
    const isOptionCorrect = index === question.correctIndex;

    if (revealed) {
      if (isOptionCorrect) return { background: '#d4edda', border: `2px solid ${colors.green}`, color: '#155724' };
      if (isSelected && !isOptionCorrect) return { background: '#f8d7da', border: `2px solid ${colors.red}`, color: '#721c24' };
      return { background: '#fff', border: '2px solid #eee', color: '#999' };
    }

    if (isSelected) return { background: colors.lightGold, border: `2px solid ${colors.orange}`, color: colors.darkBrown };
    return { background: '#fff', border: '2px solid #eee', color: colors.darkBrown };
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: '20px',
      maxWidth: 500,
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Question */}
      <div style={{
        background: '#fff',
        borderRadius: 18,
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: `1px solid ${colors.lightOrange}`,
      }}>
        {wagered > 0 && (
          <div style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 10,
            background: colors.lightGold,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: colors.orange,
            marginBottom: 10,
          }}>
            Wagered {'⭐'.repeat(wagered)}
          </div>
        )}
        <p style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: colors.darkBrown,
          margin: 0,
          lineHeight: 1.5,
        }}>
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={revealed}
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              cursor: revealed ? 'default' : 'pointer',
              fontSize: '0.95rem',
              fontWeight: 500,
              textAlign: 'left',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              ...getOptionStyle(i),
            }}
          >
            <span style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700,
              flexShrink: 0,
              background: revealed && i === question.correctIndex ? colors.green :
                          revealed && selected === i ? colors.red : '#f0f0f0',
              color: revealed && (i === question.correctIndex || selected === i) ? '#fff' : '#666',
            }}>
              {revealed && i === question.correctIndex ? '✓' :
               revealed && selected === i ? '✗' :
               String.fromCharCode(65 + i)}
            </span>
            <span>{option}</span>
          </button>
        ))}
      </div>

      {/* Confirm button */}
      {!revealed && selected !== null && (
        <button
          onClick={handleConfirm}
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
          Lock In Answer
        </button>
      )}

      {/* Revealed section */}
      {revealed && (
        <>
          {/* Answer result banner */}
          <div style={{
            textAlign: 'center',
            padding: '8px 16px',
            borderRadius: 12,
            background: isCorrect ? '#d4edda' : '#f8d7da',
            color: isCorrect ? '#155724' : '#721c24',
            fontSize: '0.9rem',
            fontWeight: 700,
            animation: 'fadeIn 0.4s ease',
          }}>
            {isCorrect && wagered === 0 && '🎉 Correct! +1 space forward.'}
            {isCorrect && wagered > 0 && `🎉 Wager won! +${wagered} bonus ${'⭐'.repeat(wagered)} and ${wagered} extra spaces forward!`}
            {!isCorrect && wagered === 0 && '😬 Wrong! Back 1 space.'}
            {!isCorrect && wagered > 0 && `😬 Wager lost! -${wagered} ${'⭐'.repeat(wagered)} and ${wagered} spaces back!`}
          </div>

          {/* Explanation */}
          <div style={{
            background: colors.lightGold,
            borderRadius: 14,
            padding: '16px',
            borderLeft: `4px solid ${colors.gold}`,
            animation: 'fadeIn 0.4s ease',
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: colors.darkBrown,
              lineHeight: 1.6,
            }}>
              <strong>💡 Did you know?</strong> {question.explanation}
            </p>
          </div>

          {/* Go Deeper — only when deepDive content exists */}
          {!showDeepDive && question.deepDive && (
            <button
              onClick={() => setShowDeepDive(true)}
              style={{
                padding: '10px 20px',
                borderRadius: 20,
                border: '2px solid #3498DB',
                background: '#fff',
                color: '#3498DB',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                alignSelf: 'center',
              }}
            >
              📚 Go Deeper
            </button>
          )}
          {showDeepDive && question.deepDive && (
            <div style={{
              background: '#D6EAF8',
              borderRadius: 14,
              padding: '16px',
              borderLeft: '4px solid #3498DB',
              animation: 'fadeIn 0.4s ease',
            }}>
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: colors.darkBrown,
                lineHeight: 1.7,
              }}>
                <strong>📚 Going deeper:</strong> {question.deepDive}
              </p>
            </div>
          )}

          {/* Spaced repetition note on wrong answers */}
          {!isCorrect && (
            <p style={{
              margin: 0,
              fontSize: '0.8rem',
              color: '#666',
              fontStyle: 'italic',
              textAlign: 'center',
            }}>
              🔄 This will come back in a future round so you can reinforce it!
            </p>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Double or Nothing — only on wrong answers */}
            {!isCorrect && onDoubleOrNothing && (
              <button
                onClick={onDoubleOrNothing}
                style={{
                  padding: '12px 20px',
                  borderRadius: 25,
                  border: `2px solid #9B59B6`,
                  background: '#fff',
                  color: '#9B59B6',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🎲 Double or Nothing
              </button>
            )}
            {onRetire && (
              <button
                onClick={() => { onRetire(question.id); handleContinue(); }}
                style={{
                  padding: '12px 16px',
                  borderRadius: 25,
                  border: '2px solid #bbb',
                  background: '#fff',
                  color: '#888',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Don't show again
              </button>
            )}
            <button
              onClick={handleContinue}
              style={{
                padding: '12px 30px',
                borderRadius: 25,
                border: 'none',
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.orange})`,
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(230, 126, 34, 0.3)',
              }}
            >
              Continue →
            </button>
          </div>
        </>
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
