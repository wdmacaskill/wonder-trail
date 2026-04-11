import { useState, useCallback } from 'react';
import type { Category, RoundState, AnyQuestion, GameSession, QuestionHistory } from '../types';
import { pickNextQuestion, pickSpecialQuestion, isSpecialSpace, BOARD_GOAL, getDifficultyForPosition } from '../utils/questionPicker';
import { loadSession, saveSession } from '../utils/storage';

export function useGameState() {
  const [session, setSession] = useState<GameSession>(loadSession);
  const [round, setRound] = useState<RoundState | null>(null);

  const persistSession = useCallback((updated: GameSession) => {
    setSession(updated);
    saveSession(updated);
  }, []);

  const startRound = useCallback((categories: Category[]) => {
    const usedThisRound = new Set<string>();
    const firstQ = pickNextQuestion(categories, 0, session.questionHistory, usedThisRound);
    usedThisRound.add(firstQ.id);

    setRound({
      categories,
      questions: [firstQ],
      currentIndex: 0,
      boardPosition: 0,
      stars: 0,
      streak: 0,
      maxStreak: 0,
      answers: [],
      usedThisRound,
      phase: 'board',
    });
  }, [session.questionHistory]);

  const setPhase = useCallback((phase: RoundState['phase']) => {
    setRound(prev => prev ? { ...prev, phase } : null);
  }, []);

  const answerQuestion = useCallback((questionId: string, correct: boolean, wagered: number) => {
    setRound(prev => {
      if (!prev) return null;
      const starsEarned = correct ? (wagered > 0 ? wagered : 1) : -(wagered > 0 ? wagered : 0);
      const newStreak = correct ? prev.streak + 1 : 0;
      const spacesForward = wagered > 0 ? wagered : 1;
      const spacesBackward = wagered > 0 ? wagered : 1;

      let newPosition = correct
        ? Math.min(prev.boardPosition + spacesForward, BOARD_GOAL)
        : Math.max(prev.boardPosition - spacesBackward, 0);

      // If moving forward would cross a special space, stop AT the special space
      // (player must answer the special Q to cross it)
      if (correct) {
        for (const sp of [6, 12, 18]) {
          if (prev.boardPosition < sp && newPosition >= sp) {
            // Stop at the special space — don't go past it
            newPosition = sp;
            break;
          }
        }
      }

      return {
        ...prev,
        boardPosition: newPosition,
        stars: Math.max(0, prev.stars + starsEarned),
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        answers: [...prev.answers, { questionId, correct, wagered }],
        phase: 'answer-reveal',
      };
    });

    // Update session history
    setSession(prev => {
      const existing = prev.questionHistory[questionId];
      const leitnerBox = existing
        ? correct ? Math.min(existing.leitnerBox + 1, 3) : 0
        : correct ? 1 : 0;

      const history: QuestionHistory = {
        questionId,
        correct,
        timestamp: Date.now(),
        leitnerBox,
      };

      const updated = {
        ...prev,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        questionHistory: { ...prev.questionHistory, [questionId]: history },
      };
      saveSession(updated);
      return updated;
    });
  }, []);

  /** Called when a special round gate is passed (correct) or failed (wrong). */
  const answerSpecial = useCallback((questionId: string, correct: boolean) => {
    setRound(prev => {
      if (!prev) return null;
      // If correct: cross the bridge (move +1 past the special space)
      // If wrong: get pushed back 1 space
      const newPosition = correct
        ? Math.min(prev.boardPosition + 1, BOARD_GOAL)
        : Math.max(prev.boardPosition - 1, 0);
      const newStreak = correct ? prev.streak + 1 : 0;

      return {
        ...prev,
        boardPosition: newPosition,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        stars: prev.stars + (correct ? 2 : 0), // Bonus stars for crossing a bridge
        answers: [...prev.answers, { questionId, correct, wagered: 0 }],
        phase: 'answer-reveal',
      };
    });

    // Update session history for special Q too
    setSession(prev => {
      const updated = {
        ...prev,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        questionHistory: {
          ...prev.questionHistory,
          [questionId]: { questionId, correct, timestamp: Date.now(), leitnerBox: correct ? 1 : 0 },
        },
      };
      saveSession(updated);
      return updated;
    });
  }, []);

  const drawNextQuestion = useCallback(() => {
    setRound(prev => {
      if (!prev) return null;

      // Check if round is complete
      if (prev.boardPosition >= BOARD_GOAL) {
        return { ...prev, phase: 'complete' };
      }

      // Check if we're sitting on a special space (gate to cross)
      if (isSpecialSpace(prev.boardPosition)) {
        const specialQ = pickSpecialQuestion(prev.categories, session.questionHistory, prev.usedThisRound);
        if (specialQ) {
          prev.usedThisRound.add(specialQ.id);
          return {
            ...prev,
            questions: [...prev.questions, specialQ],
            currentIndex: prev.questions.length,
            phase: 'special',
          };
        }
        // No special available for these categories — skip the gate, draw a regular question
      }

      // Draw a standard question based on current board position (determines difficulty)
      const nextQ = pickNextQuestion(prev.categories, prev.boardPosition, session.questionHistory, prev.usedThisRound);
      prev.usedThisRound.add(nextQ.id);
      return {
        ...prev,
        questions: [...prev.questions, nextQ],
        currentIndex: prev.questions.length,
        phase: 'board',
      };
    });
  }, [session.questionHistory]);

  const completeRound = useCallback(() => {
    setSession(prev => {
      const updated: GameSession = {
        ...prev,
        totalStars: prev.totalStars + (round?.stars ?? 0),
        longestStreak: Math.max(prev.longestStreak, round?.maxStreak ?? 0),
        roundsCompleted: prev.roundsCompleted + 1,
      };
      saveSession(updated);
      return updated;
    });
    setRound(null);
  }, [round]);

  const currentQuestion: AnyQuestion | null = round
    ? round.questions[round.currentIndex] ?? null
    : null;

  return {
    session,
    round,
    currentQuestion,
    startRound,
    setPhase,
    answerQuestion,
    answerSpecial,
    drawNextQuestion,
    completeRound,
    persistSession,
    boardGoal: BOARD_GOAL,
    getDifficultyForPosition,
  };
}
