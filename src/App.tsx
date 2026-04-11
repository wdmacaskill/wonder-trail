import { useState, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { checkBadges } from './hooks/useAchievements';
import { HomeScreen } from './components/HomeScreen';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { QuestionCard } from './components/QuestionCard';
import { WagerPicker } from './components/WagerPicker';
import { SpecialRound } from './components/SpecialRound';
import { RoundComplete } from './components/RoundComplete';
import { Achievements } from './components/Achievements';
import { PinGate } from './components/PinGate';
import type { Badge, Category, Question, SpecialQuestion } from './types';
import { ZoneCelebration } from './components/ZoneCelebration';
import { pickHarderQuestion } from './utils/questionPicker';
import { colors } from './styles/theme';
import { saveSession } from './utils/storage';

import { DailyChallenge } from './components/DailyChallenge';

type Screen = 'home' | 'category-select' | 'game' | 'achievements' | 'daily';
type ZoneEvent = 'meadow-complete' | 'forest-complete' | 'mountain-complete' | 'dragon-complete' | 'summit' | null;

export default function App() {
  const game = useGameState();
  const [screen, setScreen] = useState<Screen>('home');
  const [wagered, setWagered] = useState(0);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [pinVerified, setPinVerified] = useState(() => game.session.pinVerified);
  const [zoneCelebration, setZoneCelebration] = useState<ZoneEvent>(null);
  const [lastZonePosition, setLastZonePosition] = useState(0);
  const [isDoubleOrNothing, setIsDoubleOrNothing] = useState(false);

  const handlePinVerified = useCallback(() => {
    setPinVerified(true);
    const updated = { ...game.session, pinVerified: true };
    game.persistSession(updated);
  }, [game]);

  const handleStartRound = useCallback((categories: Category[]) => {
    game.startRound(categories);
    setScreen('game');
  }, [game]);

  const handleWager = useCallback((amount: number) => {
    setWagered(amount);
    game.setPhase('question');
  }, [game]);

  const handleSkipWager = useCallback(() => {
    setWagered(0);
    game.setPhase('question');
  }, [game]);

  const handleAnswer = useCallback((correct: boolean) => {
    if (!game.currentQuestion) return;
    // Double or Nothing: wager 2 (recover 2 spaces if right, lose 2 if wrong)
    const effectiveWager = isDoubleOrNothing ? 2 : wagered;
    game.answerQuestion(game.currentQuestion.id, correct, effectiveWager);
  }, [game, wagered, isDoubleOrNothing]);

  const handleSpecialComplete = useCallback((correct: boolean) => {
    if (!game.currentQuestion) return;
    game.answerSpecial(game.currentQuestion.id, correct);
  }, [game]);

  const handleRetireQuestion = useCallback((questionId: string) => {
    // Set leitnerBox to 99 so it won't resurface until all others are exhausted
    const updated = { ...game.session };
    updated.questionHistory = {
      ...updated.questionHistory,
      [questionId]: {
        questionId,
        correct: true,
        timestamp: Date.now(),
        leitnerBox: 99,
      },
    };
    game.persistSession(updated);
  }, [game]);

  const handleAdvance = useCallback(() => {
    setWagered(0);
    setIsDoubleOrNothing(false);
    game.drawNextQuestion();
  }, [game]);

  const handleDoubleOrNothing = useCallback(() => {
    if (!game.currentQuestion || !game.round) return;
    const q = game.currentQuestion as Question;
    const harderQ = pickHarderQuestion(q.category, q.difficulty, game.session.questionHistory, game.round.usedThisRound);
    if (!harderQ) return; // No harder question available
    game.round.usedThisRound.add(harderQ.id);
    // Replace current question with harder one and go to question phase
    setIsDoubleOrNothing(true);
    setWagered(0);
    game.setPhase('question');
    // We need to add the question to the round - use a small trick via drawNextQuestion-like logic
    // Actually, let's directly set the question in the round
    game.round.questions.push(harderQ);
    game.round.currentIndex = game.round.questions.length - 1;
    // Force re-render
    game.setPhase('question');
  }, [game]);

  const handleRoundComplete = useCallback(() => {
    const badges = checkBadges(game.session, game.round);
    setNewBadges(badges);
    if (badges.length > 0) {
      saveSession(game.session);
    }
    game.setPhase('complete');
  }, [game]);

  if (!pinVerified) {
    return <PinGate onVerified={handlePinVerified} />;
  }

  if (screen === 'achievements') {
    return <Achievements session={game.session} onBack={() => setScreen('home')} />;
  }

  if (screen === 'category-select') {
    return (
      <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${colors.cream}, ${colors.warmWhite})` }}>
        <CategorySelect onStart={handleStartRound} />
      </div>
    );
  }

  if (screen === 'game' && game.round) {
    const { round, currentQuestion } = game;

    if (round.phase === 'complete') {
      return (
        <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${colors.cream}, ${colors.warmWhite})` }}>
          <RoundComplete
            round={round}
            newBadges={newBadges}
            onFinish={() => {
              game.completeRound();
              setScreen('home');
            }}
          />
        </div>
      );
    }

    if (round.phase === 'board') {
      const lastAnswer = round.answers[round.answers.length - 1];
      const mood = !lastAnswer ? 'neutral' : lastAnswer.correct ? 'happy' : 'sad';
      return (
        <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${colors.cream}, ${colors.warmWhite})` }}>
          <GameBoard
            position={round.boardPosition}
            goal={game.boardGoal}
            streak={round.streak}
            stars={round.stars}
            mood={mood}
            onContinue={() => {
              if (!currentQuestion) {
                handleRoundComplete();
                return;
              }
              // Standard question: go to wager screen
              game.setPhase('wager');
            }}
          />
        </div>
      );
    }

    if (round.phase === 'wager' && currentQuestion && !('type' in currentQuestion)) {
      return (
        <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${colors.cream}, ${colors.warmWhite})`, display: 'flex', alignItems: 'center' }}>
          <WagerPicker
            category={(currentQuestion as Question).category}
            difficulty={(currentQuestion as Question).difficulty}
            onWager={handleWager}
            onSkip={handleSkipWager}
          />
        </div>
      );
    }

    if (round.phase === 'question' && currentQuestion && !('type' in currentQuestion)) {
      return (
        <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${colors.cream}, ${colors.warmWhite})` }}>
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion as Question}
            wagered={isDoubleOrNothing ? 2 : wagered}
            onAnswer={handleAnswer}
            onDoubleOrNothing={!isDoubleOrNothing && (currentQuestion as Question).difficulty !== 'hard' ? handleDoubleOrNothing : undefined}
            onRetire={handleRetireQuestion}
          />
        </div>
      );
    }

    if (round.phase === 'special' && currentQuestion && 'type' in currentQuestion) {
      return (
        <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${colors.cream}, ${colors.warmWhite})` }}>
          <SpecialRound
            key={currentQuestion.id}
            question={currentQuestion as SpecialQuestion}
            onComplete={handleSpecialComplete}
          />
        </div>
      );
    }

    // Show zone celebration overlay (must be checked BEFORE answer-reveal)
    if (zoneCelebration) {
      return (
        <ZoneCelebration
          zone={zoneCelebration}
          onDone={() => {
            const wasSummit = zoneCelebration === 'summit';
            setZoneCelebration(null);
            if (wasSummit) {
              handleRoundComplete();
            } else {
              handleAdvance();
            }
          }}
        />
      );
    }

    if (round.phase === 'answer-reveal') {
      const prevPos = lastZonePosition;
      const newPos = round.boardPosition;

      // Detect zone crossings: meadow(0-5) → forest(6-11) → mountain(12-17) → dragon(18-19) → summit(20)
      if (prevPos < 7 && newPos >= 7) {
        setLastZonePosition(newPos);
        setZoneCelebration('meadow-complete');
        return null;
      }
      if (prevPos < 13 && newPos >= 13) {
        setLastZonePosition(newPos);
        setZoneCelebration('forest-complete');
        return null;
      }
      if (prevPos < 19 && newPos >= 19) {
        setLastZonePosition(newPos);
        setZoneCelebration('mountain-complete');
        return null;
      }

      setLastZonePosition(newPos);

      if (round.boardPosition >= game.boardGoal) {
        setZoneCelebration('summit');
        return null;
      }

      handleAdvance();
      return null;
    }
  }

  if (screen === 'daily') {
    return (
      <DailyChallenge
        session={game.session}
        onSaveResult={(date, score, total) => {
          const updated = {
            ...game.session,
            dailyChallenges: {
              ...game.session.dailyChallenges,
              [date]: { date, score, total },
            },
          };
          game.persistSession(updated);
        }}
        onBack={() => setScreen('home')}
      />
    );
  }

  return (
    <HomeScreen
      session={game.session}
      onNewRound={() => setScreen('category-select')}
      onAchievements={() => setScreen('achievements')}
      onDailyChallenge={() => setScreen('daily')}
    />
  );
}
