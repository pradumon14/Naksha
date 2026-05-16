import { useState, useCallback, useEffect } from 'react';
import { shuffleArray, playSound } from '../utils';
import { MapLocation } from '../types';

/**
 * Custom hook that manages the state and logic for the gamified geography quiz.
 * Handles randomization, scoring, feedback, and session lifecycle.
 */
export const useQuizEngine = () => {
    const [quizActive, setQuizActive] = useState(false);
    const [quizQueue, setQuizQueue] = useState<MapLocation[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizTarget, setQuizTarget] = useState<MapLocation | null>(null);
    
    const [points, setPoints] = useState(() => {
        const saved = localStorage.getItem('naksha_points');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem('naksha_streak');
        return saved ? parseInt(saved, 10) : 0;
    });

    useEffect(() => {
        localStorage.setItem('naksha_points', points.toString());
        localStorage.setItem('naksha_streak', streak.toString());
    }, [points, streak]);

    const [quizFeedback, setQuizFeedback] = useState<'none'|'correct'|'wrong'>('none');
    const [hintRevealed, setHintRevealed] = useState(false);
    const [quizLocked, setQuizLocked] = useState(false);
    const [quizMistakes, setQuizMistakes] = useState<MapLocation[]>([]);
    const [isQuizSummaryOpen, setIsQuizSummaryOpen] = useState(false);
    const [countdownVal, setCountdownVal] = useState<number | null>(null);
    const [wrongLocation, setWrongLocation] = useState<{x: number, y: number} | null>(null);
    const [pointAnimation, setPointAnimation] = useState<{val: number, id: number} | null>(null);

    const animatePoints = useCallback((val: number) => {
        setPointAnimation({ val, id: Date.now() });
        setTimeout(() => setPointAnimation(null), 1000);
    }, []);

    const initQuizSession = useCallback((locations: MapLocation[]) => {
        const queue = shuffleArray(locations);
        setQuizQueue(queue);
        setCurrentQuestionIndex(0);
        setQuizMistakes([]);
        setQuizTarget(queue[0]);
        setQuizActive(true); 
        setQuizFeedback('none');
        setHintRevealed(false);
        setQuizLocked(false);
        setIsQuizSummaryOpen(false);
        setStreak(0);
        setWrongLocation(null);
        setCountdownVal(null); 
    }, []);

    const finishQuiz = useCallback(() => {
        setQuizActive(false);
        playSound('finish');
        if (quizMistakes.length === 0 && quizQueue.length > 0) {
            setTimeout(() => {
                setPoints(p => p + 25);
                animatePoints(25);
                playSound('finish');
            }, 500);
        }
        setIsQuizSummaryOpen(true);
    }, [quizMistakes.length, quizQueue.length, animatePoints]);

    const proceedToNextQuestion = useCallback(() => {
        const nextIdx = currentQuestionIndex + 1;
        if (nextIdx < quizQueue.length) {
            setCurrentQuestionIndex(nextIdx);
            setQuizTarget(quizQueue[nextIdx]);
            setQuizFeedback('none');
            setHintRevealed(false);
            setQuizLocked(false);
            setWrongLocation(null);
        } else {
            finishQuiz();
        }
    }, [currentQuestionIndex, quizQueue, finishQuiz]);

    const handleMapClick = useCallback((loc: MapLocation) => {
        if (!quizActive || !quizTarget || quizLocked) return false;

        if (loc.name === quizTarget.name) {
            // Correct
            playSound('correct');
            const streakBonus = Math.min(streak * 2, 10);
            const pts = 10 + streakBonus;
            
            setPoints(p => p + pts);
            animatePoints(pts);
            setStreak(s => s + 1);
            setQuizFeedback('correct');
            setQuizLocked(true);
            
            setTimeout(() => {
                proceedToNextQuestion();
            }, 1500);
            return true;
        } else {
            // Wrong
            playSound('wrong');
            setQuizFeedback('wrong');
            setStreak(0);
            setQuizLocked(true);
            setWrongLocation(loc.coords);
            
            setQuizMistakes(prev => {
                if (!prev.some(m => m.name === quizTarget.name)) {
                    return [...prev, quizTarget];
                }
                return prev;
            });
            
            setTimeout(() => {
                proceedToNextQuestion();
            }, 2500);
            return false;
        }
    }, [quizActive, quizTarget, quizLocked, streak, proceedToNextQuestion, animatePoints]);

    const handleUseHint = useCallback(() => {
        if (hintRevealed || quizLocked) return;
        setHintRevealed(true);
        setPoints(p => Math.max(0, p - 5));
        animatePoints(-5);
        playSound('click');
    }, [hintRevealed, quizLocked, animatePoints]);

    const skipQuestion = useCallback(() => {
        if (quizLocked || !quizTarget) return;
        setQuizMistakes(prev => [...prev, quizTarget]);
        setStreak(0);
        proceedToNextQuestion();
    }, [quizLocked, quizTarget, proceedToNextQuestion]);

    const resetQuizState = useCallback(() => {
        setQuizActive(false);
        setQuizTarget(null);
        setQuizFeedback('none');
        setHintRevealed(false);
        setIsQuizSummaryOpen(false);
        setStreak(0);
        setCountdownVal(null);
        setWrongLocation(null);
    }, []);

    return {
        quizActive, setQuizActive, quizQueue, currentQuestionIndex, quizTarget, points, setPoints,
        quizFeedback, hintRevealed, quizLocked, quizMistakes, isQuizSummaryOpen, setIsQuizSummaryOpen,
        streak, countdownVal, setCountdownVal, wrongLocation, pointAnimation, setPointAnimation,
        initQuizSession, finishQuiz, proceedToNextQuestion, handleMapClick, handleUseHint, skipQuestion, resetQuizState
    };
};
