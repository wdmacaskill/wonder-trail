import type { GameSession, Badge } from '../types';

const STORAGE_KEY = 'wonder-trail-session';

const DEFAULT_BADGES: Badge[] = [
  { id: 'first-round', name: 'First Steps', description: 'Complete your first round', icon: '🐾', earned: false },
  { id: 'perfect-round', name: 'Perfect Round', description: 'Answer every question correctly in a round', icon: '✨', earned: false },
  { id: 'fifty-questions', name: 'Half Century', description: 'Answer 50 questions', icon: '🎯', earned: false },
  { id: 'hundred-questions', name: 'Century Club', description: 'Answer 100 questions', icon: '💯', earned: false },
  { id: 'streak-5', name: 'On Fire', description: 'Get 5 in a row correct', icon: '🔥', earned: false },
  { id: 'streak-10', name: 'Unstoppable', description: 'Get 10 in a row correct', icon: '⚡', earned: false },
  { id: 'space-expert', name: 'Stargazer', description: 'Answer 20 Space & Cosmos questions correctly', icon: '🌟', earned: false },
  { id: 'biology-expert', name: 'Naturalist', description: 'Answer 20 Life & Biology questions correctly', icon: '🌱', earned: false },
  { id: 'brain-expert', name: 'Mind Reader', description: 'Answer 20 Brain & Mind questions correctly', icon: '🧠', earned: false },
  { id: 'physics-expert', name: 'Alchemist', description: 'Answer 20 Physics & Chemistry questions correctly', icon: '⚗️', earned: false },
  { id: 'history-expert', name: 'Time Traveller', description: 'Answer 20 History questions correctly', icon: '⏳', earned: false },
  { id: 'human-expert', name: 'People Person', description: 'Answer 20 Human Nature questions correctly', icon: '🤝', earned: false },
  { id: 'maths-expert', name: 'Mathematician', description: 'Answer 20 Maths & Logic questions correctly', icon: '📐', earned: false },
  { id: 'cs-expert', name: 'Coder', description: 'Answer 20 CS & AI questions correctly', icon: '💻', earned: false },
  { id: 'economics-expert', name: 'Economist', description: 'Answer 20 Economics questions correctly', icon: '📊', earned: false },
  { id: 'philosophy-expert', name: 'Philosopher', description: 'Answer 20 Philosophy questions correctly', icon: '🏛️', earned: false },
  { id: 'ai-technical-expert', name: 'ML Engineer', description: 'Answer 20 AI Technical questions correctly', icon: '🧪', earned: false },
  { id: 'ai-alignment-expert', name: 'Alignment Researcher', description: 'Answer 20 AI Alignment questions correctly', icon: '🎯', earned: false },
  { id: 'ai-governance-expert', name: 'Policy Wonk', description: 'Answer 20 AI Gov & Hardware questions correctly', icon: '🏗️', earned: false },
  { id: 'us-government-expert', name: 'Civics Expert', description: 'Answer 20 US Government questions correctly', icon: '🇺🇸', earned: false },
  { id: 'high-roller', name: 'High Roller', description: 'Win a 3-star wager', icon: '🎰', earned: false },
  { id: 'ten-rounds', name: 'Veteran', description: 'Complete 10 rounds', icon: '🏅', earned: false },
];

function getDefaultSession(): GameSession {
  return {
    totalStars: 0,
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    longestStreak: 0,
    roundsCompleted: 0,
    questionHistory: {},
    badges: DEFAULT_BADGES.map(b => ({ ...b })),
    pinVerified: false,
  };
}

export function loadSession(): GameSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSession();
    const session = JSON.parse(raw) as GameSession;
    // Ensure any new badges are added
    const existingIds = new Set(session.badges.map(b => b.id));
    for (const badge of DEFAULT_BADGES) {
      if (!existingIds.has(badge.id)) {
        session.badges.push({ ...badge });
      }
    }
    return session;
  } catch {
    return getDefaultSession();
  }
}

export function saveSession(session: GameSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function resetSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}
