import { useState, useCallback, useEffect, useRef } from 'react';
import { shuffleArray, playSound } from '../utils';
import { MapLocation } from '../types';

export const HINT_COST = 20;

/**
 * Custom hook that manages the state and logic for the gamified geography quiz.
 * Handles randomization, scoring, feedback, and session lifecycle.
 */
export const useQuizEngine = () => {
    const [quizActive, setQuizActive] = useState(false);
    const [quizQueue, setQuizQueue] = useState<MapLocation[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizTarget, setQuizTarget] = useState<MapLocation | null>(null);
    
    const [points, setPoints] = useState<number>(() => {
        try {
            const saved = localStorage.getItem('naksha_points');
            if (saved) {
                const parsed = parseInt(saved, 10);
                return Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
            }
        } catch (e) {
            console.warn('Failed to read naksha_points from localStorage', e);
        }
        return 0;
    });

    const [streak, setStreak] = useState<number>(() => {
        try {
            const saved = localStorage.getItem('naksha_streak');
            if (saved) {
                const parsed = parseInt(saved, 10);
                return Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
            }
        } catch (e) {
            console.warn('Failed to read naksha_streak from localStorage', e);
        }
        return 0;
    });

    useEffect(() => {
        try {
            localStorage.setItem('naksha_points', points.toString());
            localStorage.setItem('naksha_streak', streak.toString());
        } catch (e) {
            console.warn('Failed to save points/streak to localStorage', e);
        }
    }, [points, streak]);

    const [quizFeedback, setQuizFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
    const [hintRevealed, setHintRevealed] = useState(false);
    const [quizLocked, setQuizLocked] = useState(false);
    const [quizMistakes, setQuizMistakes] = useState<MapLocation[]>([]);
    const [isQuizSummaryOpen, setIsQuizSummaryOpen] = useState(false);
    const [countdownVal, setCountdownVal] = useState<number | null>(null);
    const [wrongLocation, setWrongLocation] = useState<{ x: number, y: number } | null>(null);
    const [lastClickedLocation, setLastClickedLocation] = useState<MapLocation | null>(null);
    const [pointAnimation, setPointAnimation] = useState<{ val: number, id: number } | null>(null);

    // Timer refs to prevent memory leaks and state updates after teardown
    const questionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pointAnimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearAllTimers = useCallback(() => {
        if (questionTimerRef.current) {
            clearTimeout(questionTimerRef.current);
            questionTimerRef.current = null;
        }
        if (feedbackTimerRef.current) {
            clearTimeout(feedbackTimerRef.current);
            feedbackTimerRef.current = null;
        }
        if (pointAnimTimerRef.current) {
            clearTimeout(pointAnimTimerRef.current);
            pointAnimTimerRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => clearAllTimers();
    }, [clearAllTimers]);

    const animatePoints = useCallback((val: number) => {
        if (pointAnimTimerRef.current) clearTimeout(pointAnimTimerRef.current);
        setPointAnimation({ val, id: Date.now() });
        pointAnimTimerRef.current = setTimeout(() => {
            setPointAnimation(null);
            pointAnimTimerRef.current = null;
        }, 1000);
    }, []);

    const initQuizSession = useCallback((locations: MapLocation[]) => {
        clearAllTimers();
        const queue = shuffleArray(locations);
        setQuizQueue(queue);
        setCurrentQuestionIndex(0);
        setQuizMistakes([]);
        setQuizTarget(queue.length > 0 ? queue[0] : null);
        setQuizActive(true); 
        setQuizFeedback('none');
        setHintRevealed(false);
        setQuizLocked(false);
        setIsQuizSummaryOpen(false);
        setStreak(0);
        setWrongLocation(null);
        setLastClickedLocation(null);
        setCountdownVal(null); 
    }, [clearAllTimers]);

    const finishQuiz = useCallback(() => {
        clearAllTimers();
        setQuizActive(false);
        playSound('finish');
        if (quizMistakes.length === 0 && quizQueue.length > 0) {
            feedbackTimerRef.current = setTimeout(() => {
                setPoints(p => p + 25);
                animatePoints(25);
                playSound('finish');
                feedbackTimerRef.current = null;
            }, 500);
        }
        setIsQuizSummaryOpen(true);
    }, [quizMistakes.length, quizQueue.length, animatePoints, clearAllTimers]);

    const proceedToNextQuestion = useCallback(() => {
        const nextIdx = currentQuestionIndex + 1;
        if (nextIdx < quizQueue.length) {
            setCurrentQuestionIndex(nextIdx);
            setQuizTarget(quizQueue[nextIdx]);
            setQuizFeedback('none');
            setHintRevealed(false);
            setQuizLocked(false);
            setWrongLocation(null);
            setLastClickedLocation(null);
        } else {
            finishQuiz();
        }
    }, [currentQuestionIndex, quizQueue, finishQuiz]);

    const handleMapClick = useCallback((loc: MapLocation) => {
        if (!quizActive || !quizTarget || quizLocked) return false;

        setLastClickedLocation(loc);

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
            
            if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
            questionTimerRef.current = setTimeout(() => {
                proceedToNextQuestion();
                questionTimerRef.current = null;
            }, 1600);
            return true;
        } else {
            // Wrong / Learning opportunity
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
            
            if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
            questionTimerRef.current = setTimeout(() => {
                proceedToNextQuestion();
                questionTimerRef.current = null;
            }, 2800);
            return false;
        }
    }, [quizActive, quizTarget, quizLocked, streak, proceedToNextQuestion, animatePoints]);

    const handleUseHint = useCallback(() => {
        if (hintRevealed || quizLocked) return;
        setHintRevealed(true);
        setPoints(p => Math.max(0, p - HINT_COST));
        animatePoints(-HINT_COST);
        playSound('click');
    }, [hintRevealed, quizLocked, animatePoints]);

    const skipQuestion = useCallback(() => {
        if (quizLocked || !quizTarget) return;
        setQuizMistakes(prev => {
            if (!prev.some(m => m.name === quizTarget.name)) {
                return [...prev, quizTarget];
            }
            return prev;
        });
        setStreak(0);
        proceedToNextQuestion();
    }, [quizLocked, quizTarget, proceedToNextQuestion]);

    const resetQuizState = useCallback(() => {
        clearAllTimers();
        setQuizActive(false);
        setQuizTarget(null);
        setQuizFeedback('none');
        setHintRevealed(false);
        setIsQuizSummaryOpen(false);
        setStreak(0);
        setCountdownVal(null);
        setWrongLocation(null);
        setLastClickedLocation(null);
    }, [clearAllTimers]);

    return {
        quizActive, setQuizActive, quizQueue, currentQuestionIndex, quizTarget, points, setPoints,
        quizFeedback, hintRevealed, quizLocked, quizMistakes, isQuizSummaryOpen, setIsQuizSummaryOpen,
        streak, countdownVal, setCountdownVal, wrongLocation, lastClickedLocation, pointAnimation, setPointAnimation,
        initQuizSession, finishQuiz, proceedToNextQuestion, handleMapClick, handleUseHint, skipQuestion, resetQuizState,
        animatePoints
    };
};
