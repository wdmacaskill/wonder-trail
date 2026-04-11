import type { Category, Question, SpecialQuestion, Difficulty, QuestionHistory } from '../types';
import questionsData from '../data/questions.json';

interface QuestionBank {
  standard: Question[];
  special: SpecialQuestion[];
}

const bank = questionsData as QuestionBank;

// Board zones: spaces 0-5 = easy, 6-11 = medium, 12-17 = hard, 18-19 = fiendish
// Special rounds trigger at zone boundaries: 6, 12, 18
export const SPECIAL_SPACES = [6, 12, 18];
export const BOARD_GOAL = 20;

export function getDifficultyForPosition(position: number): Difficulty {
  if (position < 6) return 'easy';
  if (position < 12) return 'medium';
  if (position < 18) return 'hard';
  return 'fiendish';
}

export function isSpecialSpace(position: number): boolean {
  return SPECIAL_SPACES.includes(position);
}

/**
 * Pick a single standard question for the current board position.
 * Prioritizes unseen questions, then review questions, then seen-but-not-retired.
 */
export function pickNextQuestion(
  categories: Category[],
  position: number,
  questionHistory: Record<string, QuestionHistory>,
  usedThisRound: Set<string>,
): Question {
  const difficulty = getDifficultyForPosition(position);
  const pool = bank.standard.filter(
    q => categories.includes(q.category) && q.difficulty === difficulty && !usedThisRound.has(q.id)
  );

  const neverSeen: Question[] = [];
  const reviewPool: Question[] = [];
  const seenButNotRetired: Question[] = [];

  for (const q of pool) {
    const history = questionHistory[q.id];
    if (!history) {
      neverSeen.push(q);
    } else if (!history.correct && history.leitnerBox < 2) {
      reviewPool.push(q);
    } else if (history.leitnerBox < 3) {
      seenButNotRetired.push(q);
    }
  }

  shuffle(neverSeen);
  shuffle(reviewPool);
  shuffle(seenButNotRetired);

  // 20% chance of review question if available
  if (reviewPool.length > 0 && Math.random() < 0.2) {
    return reviewPool[0];
  }
  if (neverSeen.length > 0) return neverSeen[0];
  if (seenButNotRetired.length > 0) return seenButNotRetired[0];
  if (reviewPool.length > 0) return reviewPool[0];

  // Helper: check if question is user-retired (leitnerBox >= 99)
  const isRetired = (q: Question) => {
    const h = questionHistory[q.id];
    return h && h.leitnerBox >= 99;
  };

  // Fallback: try other difficulties in the same categories (exclude retired)
  const harderPool = bank.standard.filter(
    q => categories.includes(q.category) && !usedThisRound.has(q.id) && !isRetired(q)
  );
  shuffle(harderPool);
  if (harderPool.length > 0) return harderPool[0];

  // Last resort: any question in selected categories even if used this round (exclude retired)
  const lastResort = bank.standard.filter(q => categories.includes(q.category) && !isRetired(q));
  shuffle(lastResort);
  if (lastResort.length > 0) return lastResort[0];

  // Absolute last resort (should never happen): any question at all
  return bank.standard[Math.floor(Math.random() * bank.standard.length)];
}

/**
 * Pick a special round question, prioritizing unseen ones.
 */
export function pickSpecialQuestion(
  categories: Category[],
  questionHistory: Record<string, QuestionHistory>,
  usedThisRound: Set<string>,
): SpecialQuestion | null {
  const pool = bank.special.filter(
    q => categories.includes(q.category) && !usedThisRound.has(q.id)
  );

  const unseen = pool.filter(q => !questionHistory[q.id]);
  const seen = pool.filter(q => questionHistory[q.id]);

  shuffle(unseen);
  shuffle(seen);

  // Fallback: any special from selected categories (even if used this round)
  const anyInCat = bank.special.filter(q => categories.includes(q.category));
  shuffle(anyInCat);

  // Return null if no specials exist for these categories — game will skip the gate
  return unseen[0] ?? seen[0] ?? anyInCat[0] ?? null;
}

/**
 * Pick a harder question from the same category for "Double or Nothing".
 */
export function pickHarderQuestion(
  category: Category,
  currentDifficulty: Difficulty,
  questionHistory: Record<string, QuestionHistory>,
  usedThisRound: Set<string>,
): Question | null {
  const harderDifficulty: Difficulty = currentDifficulty === 'easy' ? 'medium' : 'hard';
  const pool = bank.standard.filter(
    q => q.category === category && q.difficulty === harderDifficulty && !usedThisRound.has(q.id)
  );
  const unseen = pool.filter(q => !questionHistory[q.id]);
  shuffle(unseen);
  const seen = pool.filter(q => questionHistory[q.id]);
  shuffle(seen);
  return unseen[0] ?? seen[0] ?? null;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
