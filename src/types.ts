export type Category =
  | 'space'
  | 'biology'
  | 'brain'
  | 'physics'
  | 'history'
  | 'human-nature'
  | 'maths'
  | 'cs-ai'
  | 'economics'
  | 'philosophy'
  | 'ai-technical'
  | 'ai-alignment'
  | 'ai-governance'
  | 'us-government';

export const CATEGORY_LABELS: Record<Category, string> = {
  space: 'Space & Cosmos',
  biology: 'Life & Biology',
  brain: 'Brain & Mind',
  physics: 'Physics & Chemistry',
  history: 'History & Civilisation',
  'human-nature': 'Human Nature',
  maths: 'Maths & Logic',
  'cs-ai': 'CS & AI',
  economics: 'Economics & Finance',
  philosophy: 'Philosophy',
  'ai-technical': 'AI Technical',
  'ai-alignment': 'AI Alignment',
  'ai-governance': 'AI Gov & Hardware',
  'us-government': 'US Government',
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  space: '🌌',
  biology: '🌿',
  brain: '🧠',
  physics: '⚛️',
  history: '🏛️',
  'human-nature': '🧑‍🤝‍🧑',
  maths: '🔢',
  'cs-ai': '🤖',
  economics: '📈',
  philosophy: '💭',
  'ai-technical': '🧪',
  'ai-alignment': '🎯',
  'ai-governance': '🏗️',
  'us-government': '🇺🇸',
};

export type Difficulty = 'easy' | 'medium' | 'hard' | 'fiendish';

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  /** Optional deeper explanation — shown when "Go Deeper" is tapped */
  deepDive?: string;
}

export interface OddOneOutQuestion {
  id: string;
  type: 'odd-one-out';
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  facts: [string, string, string, string];
  fakeIndex: number;
  explanation: string;
}

export interface EstimationQuestion {
  id: string;
  type: 'estimation';
  category: Category;
  difficulty: Difficulty;
  question: string;
  answer: number;
  unit: string;
  /** Low end of acceptable range. If omitted, defaults to answer * 0.5 */
  rangeLow?: number;
  /** High end of acceptable range. If omitted, defaults to answer * 2 */
  rangeHigh?: number;
  explanation: string;
}

export interface RiddleQuestion {
  id: string;
  type: 'riddle';
  category: Category;
  difficulty: Difficulty;
  riddle: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export type SpecialQuestion = OddOneOutQuestion | EstimationQuestion | RiddleQuestion;

export type AnyQuestion = Question | SpecialQuestion;

export interface QuestionHistory {
  questionId: string;
  correct: boolean;
  timestamp: number;
  leitnerBox: number; // 0 = new/wrong, 1 = seen once right, 2 = seen twice right, 3 = retired
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: number;
}

export interface DailyChallengeResult {
  score: number;
  total: number;
  date: string;
}

export interface GameSession {
  totalStars: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  longestStreak: number;
  roundsCompleted: number;
  questionHistory: Record<string, QuestionHistory>;
  badges: Badge[];
  pinVerified: boolean;
  dailyChallenges?: Record<string, DailyChallengeResult>;
}

export interface RoundState {
  categories: Category[];
  questions: AnyQuestion[];
  currentIndex: number;
  boardPosition: number;
  stars: number;
  streak: number;
  maxStreak: number;
  answers: { questionId: string; correct: boolean; wagered: number }[];
  usedThisRound: Set<string>;
  phase: 'category-select' | 'board' | 'question' | 'wager' | 'answer-reveal' | 'special' | 'complete';
}
