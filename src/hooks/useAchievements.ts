import type { GameSession, RoundState, Badge, Category } from '../types';

const CATEGORY_BADGE_MAP: Record<Category, string> = {
  space: 'space-expert',
  biology: 'biology-expert',
  brain: 'brain-expert',
  physics: 'physics-expert',
  history: 'history-expert',
  'human-nature': 'human-expert',
  maths: 'maths-expert',
  'cs-ai': 'cs-expert',
  economics: 'economics-expert',
  philosophy: 'philosophy-expert',
  'ai-technical': 'ai-technical-expert',
  'ai-alignment': 'ai-alignment-expert',
  'ai-governance': 'ai-governance-expert',
  'us-government': 'us-government-expert',
};

export function checkBadges(session: GameSession, round: RoundState | null): Badge[] {
  const newBadges: Badge[] = [];

  for (const badge of session.badges) {
    if (badge.earned) continue;

    let earned = false;

    switch (badge.id) {
      case 'first-round':
        earned = session.roundsCompleted >= 1;
        break;
      case 'perfect-round':
        if (round) {
          const total = round.answers.length;
          const correct = round.answers.filter(a => a.correct).length;
          earned = total > 0 && correct === total;
        }
        break;
      case 'fifty-questions':
        earned = session.totalQuestionsAnswered >= 50;
        break;
      case 'hundred-questions':
        earned = session.totalQuestionsAnswered >= 100;
        break;
      case 'streak-5':
        earned = (round?.maxStreak ?? 0) >= 5 || session.longestStreak >= 5;
        break;
      case 'streak-10':
        earned = (round?.maxStreak ?? 0) >= 10 || session.longestStreak >= 10;
        break;
      case 'high-roller':
        if (round) {
          earned = round.answers.some(a => a.wagered >= 3 && a.correct);
        }
        break;
      case 'ten-rounds':
        earned = session.roundsCompleted >= 10;
        break;
      default: {
        // Category expert badges
        const categoryEntry = Object.entries(CATEGORY_BADGE_MAP).find(([, badgeId]) => badgeId === badge.id);
        if (categoryEntry) {
          const category = categoryEntry[0] as Category;
          const correctInCategory = Object.entries(session.questionHistory).filter(([id, h]) => {
            return h.correct && id.startsWith(category);
          }).length;
          earned = correctInCategory >= 20;
        }
        break;
      }
    }

    if (earned) {
      badge.earned = true;
      badge.earnedAt = Date.now();
      newBadges.push(badge);
    }
  }

  return newBadges;
}
