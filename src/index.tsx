import React, { useState, useEffect, useMemo, useRef, useLayoutEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { IndiaMapBackground } from './components/IndiaMap';
import { Header } from './components/Header';
import { MapControls } from './components/MapControls';

import { mapData, downloadsData } from './data/data';
import { useQuizEngine, HINT_COST } from './hooks/useQuizEngine';
import { LocationInfoModal } from './components/SharedComponents';
import { useMapZoom } from './hooks/useMapZoom';
import { InfoPage } from './components/InfoPage';
import { SupportPage } from './components/SupportPage';
import { MarkersLayer, LabelsLayer } from './components/MapLayers';
import { 
    DownloadsPage, 
    CategoryModal, 
    QuizSummary, 
    CountdownOverlay 
} from './components/SharedComponents';
import { 
    CalibFloatingToolbar, 
    CalibInspectorCard, 
    CursorCoordsBadge, 
    AddPinBanner, 
    StudioExportImportModal,
    MobileCalibSuite
} from './components/DevTools';
import { MapCategory, MapLocation } from './types';

const App: React.FC = () => {
    // Navigation State
    const [currentPage, setCurrentPage] = useState('map');
    
    // Map & Content State
    const [selectedCategory, setSelectedCategory] = useState(mapData[0].title);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [mode, setMode] = useState<'practice' | 'quiz'>('practice');
    
    // Container dimension state for marker/label scaling
    const [mapWidth, setMapWidth] = useState(
        typeof window !== 'undefined' ? Math.min(window.innerWidth, 1200) : 1000
    );
    
    // Map ref for zoom and pan interactions
    const mapRef = useRef<HTMLDivElement>(null);

    // Zoom, Pan & Drag engine via custom hook
    const {
        viewState,
        setViewState,
        isDragging,
        hasDragged,
        zoomToLocation,
        zoomAtCenter,
        resetView,
        handleMouseDown,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleKeyDown,
        isPinching
    } = useMapZoom(mapRef);
    
    // Quiz State (from Hook)
    const {
        quizActive, setQuizActive, quizQueue, currentQuestionIndex, quizTarget, points,
        quizFeedback, hintRevealed, quizLocked, quizMistakes, isQuizSummaryOpen, setIsQuizSummaryOpen,
        streak, countdownVal, setCountdownVal, wrongLocation, lastClickedLocation, pointAnimation,
        initQuizSession, proceedToNextQuestion, handleMapClick: engineHandleMapClick,
        handleUseHint, skipQuestion, resetQuizState
    } = useQuizEngine();

    // Practice State
    const [activeLocationName, setActiveLocationName] = useState<string | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); 

    // Calibration Mode State with LocalStorage Autosave
    const [isCalibrating, setIsCalibrating] = useState(false);
    const [calibratedMapData, setCalibratedMapData] = useState<MapCategory[]>(() => {
        try {
            const saved = localStorage.getItem('naksha_custom_map_data');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {}
        return mapData;
    });
    const [calibrationTargetIndex, setCalibrationTargetIndex] = useState<{ catIndex: number; locIndex: number } | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isAddingPin, setIsAddingPin] = useState(false);
    const [nudgeStep, setNudgeStep] = useState(10);
    const [hoverSvgCoords, setHoverSvgCoords] = useState<{ x: number; y: number } | null>(null);

    // Save to localStorage whenever calibratedMapData changes
    useEffect(() => {
        try {
            localStorage.setItem('naksha_custom_map_data', JSON.stringify(calibratedMapData));
        } catch (e) {}
    }, [calibratedMapData]);

    // Simple Undo/Redo History
    const [history, setHistory] = useState<MapCategory[][]>(() => [calibratedMapData]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);

    const updateMapDataWithHistory = useCallback((newData: MapCategory[]) => {
        setCalibratedMapData(newData);
        setHistory(prev => {
            const next = prev.slice(0, historyIndex + 1);
            return [...next, newData];
        });
        setHistoryIndex(prev => prev + 1);
    }, [historyIndex]);

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const nextIdx = historyIndex - 1;
            setHistoryIndex(nextIdx);
            setCalibratedMapData(history[nextIdx]);
        }
    }, [historyIndex, history]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextIdx = historyIndex + 1;
            setHistoryIndex(nextIdx);
            setCalibratedMapData(history[nextIdx]);
        }
    }, [historyIndex, history]);

    // Info Modal State
    const [infoModalData, setInfoModalData] = useState<(MapLocation & { icon?: string }) | null>(null);
    
    // Check for calibration / dev mode on mount via URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('calibrate') === 'true' || urlParams.get('dev') === 'true') {
            setIsCalibrating(true);
            setMode('practice');
        }
    }, []);

    // Countdown Logic
    useEffect(() => {
        if (countdownVal !== null) {
            if (countdownVal > 0) {
                const timeout = setTimeout(() => setCountdownVal(countdownVal - 1), 1000);
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setCountdownVal(null);
                    setQuizActive(true);
                }, 500);
                return () => clearTimeout(timeout);
            }
        }
    }, [countdownVal, setCountdownVal, setQuizActive]);

    useLayoutEffect(() => {
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.contentRect.width > 0) {
                    setMapWidth(entry.contentRect.width);
                }
            }
        });
        if (mapRef.current) observer.observe(mapRef.current);
        return () => observer.disconnect();
    }, []);

    const markerScale = useMemo(() => {
        const SVG_WIDTH = 21000;
        const safeWidth = mapWidth > 0 ? mapWidth : 1000;
        return SVG_WIDTH / (safeWidth * Math.pow(viewState.k, 0.75));
    }, [mapWidth, viewState.k]);

    const labelScale = useMemo(() => {
        const SVG_WIDTH = 21000;
        const safeWidth = mapWidth > 0 ? mapWidth : 1000;
        return SVG_WIDTH / (safeWidth * viewState.k);
    }, [mapWidth, viewState.k]);

    const activeSet = useMemo(() => calibratedMapData.find(d => d.title === selectedCategory) || calibratedMapData[0], [selectedCategory, calibratedMapData]);
    const activeCatIndex = useMemo(() => calibratedMapData.findIndex(d => d.title === selectedCategory), [selectedCategory, calibratedMapData]);

    const startQuizSession = useCallback((locations: MapLocation[]) => {
        initQuizSession(locations);
        resetView();
        if (window.innerWidth < 768) {
            setIsSidebarExpanded(false); 
        }
    }, [initQuizSession, resetView]);

    useEffect(() => {
        if (isCalibrating) return;
        setActiveLocationName(null);
        
        if (mode === 'quiz') {
            startQuizSession(activeSet.locations);
        } else {
            resetQuizState();
            resetView();
        }
    }, [selectedCategory, mode, activeSet, startQuizSession, isCalibrating, resetQuizState, resetView]);

    useEffect(() => {
        if (quizActive) {
            resetView();
        }
    }, [currentQuestionIndex, quizActive, resetView]);

    /**
     * Handles clicking a location in practice mode.
     * Zooms to the location and shows its label.
     */
    const handlePracticeClick = useCallback((loc: MapLocation) => {
        setActiveLocationName(loc.name);
        setIsSidebarExpanded(false); 
        zoomToLocation(loc.coords.x, loc.coords.y);
    }, [zoomToLocation]);

    const startQuiz = useCallback(() => {
        if (isCalibrating) return;
        setMode('quiz'); 
    }, [isCalibrating]);
    
    /**
     * Handles map clicks specifically for calibration mode.
     * Prevents clicks during map drag/pan and updates coordinates with history tracking.
     */
    const handleCalibrationMapClick = (e: React.MouseEvent) => {
        if (!isCalibrating || !mapRef.current) return;
        if (hasDragged()) return; // Ignore map pan drags
    
        const svg = mapRef.current.querySelector('svg');
        if (!svg) return;
    
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
    
        const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        const newX = Math.round(svgP.x);
        const newY = Math.round(svgP.y);

        // Add Pin Mode
        if (isAddingPin) {
            const currentCat = calibratedMapData[activeCatIndex] || calibratedMapData[0];
            const newPin: MapLocation = {
                name: `Location ${currentCat.locations.length + 1}`,
                state: 'India',
                coords: { x: newX, y: newY },
                description: 'Enter syllabus notes or description here.'
            };
            const updated = calibratedMapData.map((cat, cIdx) => {
                if (cIdx !== activeCatIndex) return cat;
                return {
                    ...cat,
                    locations: [...cat.locations, newPin]
                };
            });
            updateMapDataWithHistory(updated);
            setCalibrationTargetIndex({ catIndex: activeCatIndex, locIndex: currentCat.locations.length });
            setIsAddingPin(false);
            setIsSidebarExpanded(true);
            return;
        }

        // Relocate Selected Pin
        if (calibrationTargetIndex) {
            const { catIndex, locIndex } = calibrationTargetIndex;
            const updated = calibratedMapData.map((cat, cIdx) => {
                if (cIdx !== catIndex) return cat;
                return {
                    ...cat,
                    locations: cat.locations.map((loc, lIdx) => {
                        if (lIdx !== locIndex) return loc;
                        return { ...loc, coords: { x: newX, y: newY } };
                    })
                };
            });
            updateMapDataWithHistory(updated);
        }
    };

    /**
     * Marker Dragging in Calibration Mode
     */
    const draggingMarkerRef = useRef<{ catIndex: number; locIndex: number } | null>(null);

    const handleMarkerClick = useCallback((loc: MapLocation, locIndex?: number) => {
        if (isCalibrating) {
            if (locIndex !== undefined) {
                setCalibrationTargetIndex({ catIndex: activeCatIndex, locIndex });
            }
            return;
        }
        if (mode !== 'quiz' || !quizActive || !quizTarget) {
            handlePracticeClick(loc);
            return;
        }
        engineHandleMapClick(loc);
    }, [mode, quizActive, quizTarget, isCalibrating, activeCatIndex, handlePracticeClick, engineHandleMapClick]);

    const handleMarkerDragStart = useCallback((locIndex: number, e: React.MouseEvent) => {
        if (!isCalibrating) return;
        setCalibrationTargetIndex({ catIndex: activeCatIndex, locIndex });
        draggingMarkerRef.current = { catIndex: activeCatIndex, locIndex };
    }, [isCalibrating, activeCatIndex]);

    const handleMouseMoveOnMap = (e: React.MouseEvent) => {
        if (!isCalibrating || !mapRef.current) return;
        const svg = mapRef.current.querySelector('svg');
        if (!svg) return;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        const curX = Math.round(svgP.x);
        const curY = Math.round(svgP.y);
        setHoverSvgCoords({ x: curX, y: curY });

        if (draggingMarkerRef.current) {
            const { catIndex, locIndex } = draggingMarkerRef.current;
            setCalibratedMapData(prevData => prevData.map((cat, cIdx) => {
                if (cIdx !== catIndex) return cat;
                return {
                    ...cat,
                    locations: cat.locations.map((loc, lIdx) => {
                        if (lIdx !== locIndex) return loc;
                        return { ...loc, coords: { x: curX, y: curY } };
                    })
                };
            }));
        }
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (draggingMarkerRef.current) {
                draggingMarkerRef.current = null;
                updateMapDataWithHistory(calibratedMapData);
            }
        };
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [calibratedMapData, updateMapDataWithHistory]);

    const handleUpdateSelectedLocation = useCallback((updated: Partial<MapLocation>) => {
        if (!calibrationTargetIndex) return;
        const { catIndex, locIndex } = calibrationTargetIndex;

        const updatedData = calibratedMapData.map((cat, cIdx) => {
            if (cIdx !== catIndex) return cat;
            return {
                ...cat,
                locations: cat.locations.map((loc, lIdx) => {
                    if (lIdx !== locIndex) return loc;
                    return { ...loc, ...updated };
                })
            };
        });
        updateMapDataWithHistory(updatedData);
    }, [calibrationTargetIndex, calibratedMapData, updateMapDataWithHistory]);

    const handleDeleteSelectedLocation = useCallback(() => {
        if (!calibrationTargetIndex) return;
        const { catIndex, locIndex } = calibrationTargetIndex;
        const currentCat = calibratedMapData[catIndex];
        if (!currentCat) return;

        const updatedData = calibratedMapData.map((cat, cIdx) => {
            if (cIdx !== catIndex) return cat;
            return {
                ...cat,
                locations: cat.locations.filter((_, lIdx) => lIdx !== locIndex)
            };
        });
        updateMapDataWithHistory(updatedData);
        setCalibrationTargetIndex(null);
    }, [calibrationTargetIndex, calibratedMapData, updateMapDataWithHistory]);

    const handleDuplicateSelectedLocation = useCallback(() => {
        if (!calibrationTargetIndex) return;
        const { catIndex, locIndex } = calibrationTargetIndex;
        const currentLoc = calibratedMapData[catIndex]?.locations[locIndex];
        if (!currentLoc) return;

        const duplicated: MapLocation = {
            ...currentLoc,
            name: `${currentLoc.name} (Copy)`,
            coords: {
                x: Math.min(21000, currentLoc.coords.x + 250),
                y: Math.min(29700, currentLoc.coords.y + 250)
            }
        };

        const updatedData = calibratedMapData.map((cat, cIdx) => {
            if (cIdx !== catIndex) return cat;
            return {
                ...cat,
                locations: [...cat.locations, duplicated]
            };
        });
        updateMapDataWithHistory(updatedData);
        setCalibrationTargetIndex({ catIndex, locIndex: calibratedMapData[catIndex].locations.length });
    }, [calibrationTargetIndex, calibratedMapData, updateMapDataWithHistory]);

    const handleSelectCategoryIndex = useCallback((idx: number) => {
        if (idx >= 0 && idx < calibratedMapData.length) {
            setSelectedCategory(calibratedMapData[idx].title);
            setCalibrationTargetIndex(null);
        }
    }, [calibratedMapData]);

    const handleResetData = useCallback(() => {
        if (window.confirm("Reset all locations to original syllabus dataset? Any custom additions or edits will be restored to defaults.")) {
            try {
                localStorage.removeItem('naksha_custom_map_data');
            } catch (e) {}
            updateMapDataWithHistory(mapData);
            setCalibrationTargetIndex(null);
        }
    }, [updateMapDataWithHistory]);

    const handleImportData = useCallback((imported: MapCategory[]) => {
        updateMapDataWithHistory(imported);
        if (imported.length > 0) {
            setSelectedCategory(imported[0].title);
        }
        setCalibrationTargetIndex(null);
    }, [updateMapDataWithHistory]);

    /**
     * Nudge selected location by dx, dy
     */
    const handleNudgeLocation = useCallback((dx: number, dy: number) => {
        if (!calibrationTargetIndex) return;
        const { catIndex, locIndex } = calibrationTargetIndex;
        const currentLoc = calibratedMapData[catIndex]?.locations[locIndex];
        if (!currentLoc) return;

        const newX = Math.max(0, Math.min(21000, currentLoc.coords.x + dx));
        const newY = Math.max(0, Math.min(29700, currentLoc.coords.y + dy));

        const updated = calibratedMapData.map((cat, cIdx) => {
            if (cIdx !== catIndex) return cat;
            return {
                ...cat,
                locations: cat.locations.map((loc, lIdx) => {
                    if (lIdx !== locIndex) return loc;
                    return { ...loc, coords: { x: newX, y: newY } };
                })
            };
        });
        updateMapDataWithHistory(updated);
    }, [calibrationTargetIndex, calibratedMapData, updateMapDataWithHistory]);

    const handlePreviousLocation = useCallback(() => {
        if (!calibrationTargetIndex) {
            setCalibrationTargetIndex({ catIndex: activeCatIndex, locIndex: 0 });
            return;
        }
        const { locIndex } = calibrationTargetIndex;
        if (locIndex > 0) {
            setCalibrationTargetIndex({ catIndex: activeCatIndex, locIndex: locIndex - 1 });
        }
    }, [calibrationTargetIndex, activeCatIndex]);

    const handleNextLocation = useCallback(() => {
        const cat = calibratedMapData[activeCatIndex];
        if (!cat) return;
        if (!calibrationTargetIndex) {
            setCalibrationTargetIndex({ catIndex: activeCatIndex, locIndex: 0 });
            return;
        }
        const { locIndex } = calibrationTargetIndex;
        if (locIndex < cat.locations.length - 1) {
            setCalibrationTargetIndex({ catIndex: activeCatIndex, locIndex: locIndex + 1 });
        }
    }, [calibrationTargetIndex, activeCatIndex, calibratedMapData]);

    const handleCenterSelectedLocation = useCallback(() => {
        if (!calibrationTargetIndex) return;
        const { catIndex, locIndex } = calibrationTargetIndex;
        const loc = calibratedMapData[catIndex]?.locations[locIndex];
        if (loc) {
            zoomToLocation(loc.coords.x, loc.coords.y);
        }
    }, [calibrationTargetIndex, calibratedMapData, zoomToLocation]);

    /**
     * Clean global keyboard shortcuts for calibration
     */
    useEffect(() => {
        const handleKeyDownGlobal = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

            // Alt+C to toggle calibration mode
            if (e.altKey && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                setIsCalibrating(prev => {
                    const next = !prev;
                    if (next) setIsSidebarExpanded(true);
                    return next;
                });
                return;
            }

            if (!isCalibrating) return;

            // Arrow keys for nudging target
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                if (calibrationTargetIndex) {
                    e.preventDefault();
                    const step = e.altKey ? 1 : e.shiftKey ? 50 : nudgeStep;
                    const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
                    const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
                    handleNudgeLocation(dx, dy);
                }
                return;
            }

            // [ and ] for previous / next location
            if (e.key === '[') {
                e.preventDefault();
                handlePreviousLocation();
                return;
            }
            if (e.key === ']') {
                e.preventDefault();
                handleNextLocation();
                return;
            }

            // Space to center on target
            if (e.key === ' ') {
                if (calibrationTargetIndex) {
                    e.preventDefault();
                    handleCenterSelectedLocation();
                }
                return;
            }

            // Ctrl+Z Undo
            if (e.ctrlKey && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
                e.preventDefault();
                handleUndo();
                return;
            }

            // Ctrl+Y or Ctrl+Shift+Z Redo
            if ((e.ctrlKey && (e.key === 'y' || e.key === 'Y')) || (e.ctrlKey && e.shiftKey && (e.key === 'z' || e.key === 'Z'))) {
                e.preventDefault();
                handleRedo();
                return;
            }

            // N or A to toggle Add Pin mode
            if (e.key === 'n' || e.key === 'N' || e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                setIsAddingPin(prev => !prev);
                return;
            }

            // Delete or Backspace to delete selected pin
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (calibrationTargetIndex) {
                    e.preventDefault();
                    handleDeleteSelectedLocation();
                }
                return;
            }

            // Ctrl+D to duplicate selected pin
            if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) {
                e.preventDefault();
                handleDuplicateSelectedLocation();
                return;
            }

            // Esc to cancel Add Pin or deselect
            if (e.key === 'Escape') {
                if (isAddingPin) {
                    e.preventDefault();
                    setIsAddingPin(false);
                } else if (calibrationTargetIndex) {
                    e.preventDefault();
                    setCalibrationTargetIndex(null);
                }
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDownGlobal);
        return () => window.removeEventListener('keydown', handleKeyDownGlobal);
    }, [
        isCalibrating, 
        calibrationTargetIndex, 
        nudgeStep,
        isAddingPin,
        handleNudgeLocation, 
        handlePreviousLocation, 
        handleNextLocation, 
        handleCenterSelectedLocation, 
        handleUndo, 
        handleRedo,
        handleDeleteSelectedLocation,
        handleDuplicateSelectedLocation
    ]);

    const handleSummaryClose = () => {
        setIsQuizSummaryOpen(false);
        setMode('practice'); 
    };

    const handleSummaryRetry = () => {
        setIsQuizSummaryOpen(false);
        startQuizSession(activeSet.locations);
    };

    const handleSummaryNextTopic = () => {
        setIsQuizSummaryOpen(false);
        const nextCatIndex = (activeCatIndex + 1) % calibratedMapData.length;
        setSelectedCategory(calibratedMapData[nextCatIndex].title);
        setMode('quiz');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Naksha - Interactive Geography',
                text: 'Practice map pointing for your exams with Naksha!',
                url: window.location.href,
            }).catch(console.error);
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className={`app ${currentPage === 'map' ? 'map-view' : ''} ${mode === 'quiz' ? 'quiz-active' : ''} ${isCalibrating ? 'calibrating-active' : ''}`}>
            {mode !== 'quiz' && (
                <Header onNavigate={setCurrentPage} activePage={currentPage} />
            )}

            <main className="main-grid">
                {currentPage === 'map' ? (
                    <>
                        <div className="map-section">
                            {/* Controls Bar (Only in Practice/Calibration Mode) */}
                            {mode !== 'quiz' && (
                                <div className="controls-bar-minimal">
                                    <button 
                                        className="category-trigger-minimal" 
                                        onClick={() => setIsCategoryModalOpen(true)}
                                        aria-label={`Select category: ${selectedCategory}`}
                                    >
                                        <i className={`fas ${activeSet.icon} category-icon-mini`}></i>
                                        <span className="category-title-mini">{selectedCategory}</span>
                                        <i className="fas fa-chevron-down category-chevron-mini"></i>
                                    </button>
                                    {!isCalibrating && (
                                        <div className="mode-toggle-minimal" role="tablist" aria-label="Learning Mode">
                                            <button 
                                                className="mode-toggle-btn active" 
                                                onClick={() => setMode('practice')}
                                                role="tab"
                                                aria-selected={true}
                                            >
                                                Practice
                                            </button>
                                            <button 
                                                className="mode-toggle-btn" 
                                                onClick={startQuiz}
                                                role="tab"
                                                aria-selected={false}
                                            >
                                                Quiz
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Top HUD (Only in Quiz Mode) */}
                            {mode === 'quiz' && !isCalibrating && (
                                <div className="quiz-hud-top-minimal" role="region" aria-label="Quiz Progress and Status">
                                    <button 
                                        className="quiz-hud-exit-btn" 
                                        onClick={() => setMode('practice')}
                                        title="Exit Quiz"
                                        aria-label="Exit Quiz and return to Practice"
                                    >
                                        <i className="fas fa-arrow-left"></i>
                                        <span className="exit-label">Exit</span>
                                    </button>

                                    <div className="quiz-hud-divider"></div>

                                    <div className="quiz-hud-topic-text">
                                        <i className={`fas ${activeSet.icon}`}></i>
                                        <span>{selectedCategory}</span>
                                    </div>

                                    <div className="quiz-hud-divider"></div>

                                    <div className="quiz-hud-progress-text">
                                        {currentQuestionIndex + 1} / {quizQueue.length}
                                    </div>

                                    <div className="quiz-hud-divider"></div>

                                    <div className="quiz-hud-stats">
                                        {streak > 1 && <span className="quiz-hud-streak"><i className="fas fa-fire"></i> {streak}x</span>}
                                        <span className="quiz-hud-score"><i className="fas fa-star"></i> {points}</span>
                                        {pointAnimation && (
                                            <span key={pointAnimation.id} className={`point-float-mini ${pointAnimation.val > 0 ? 'pos' : 'neg'}`}>
                                                {pointAnimation.val > 0 ? '+' : ''}{pointAnimation.val}
                                            </span>
                                        )}
                                    </div>

                                    <div className="quiz-hud-progress-line">
                                        <div 
                                            className="quiz-hud-progress-fill" 
                                            style={{ width: `${((currentQuestionIndex + 1) / Math.max(1, quizQueue.length)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <MapControls 
                                onZoomIn={() => zoomAtCenter(1.2)} 
                                onZoomOut={() => zoomAtCenter(1 / 1.2)} 
                                onReset={resetView} 
                                onShare={handleShare}
                                isCalibrating={isCalibrating}
                                onToggleCalibrate={() => setIsCalibrating(prev => !prev)}
                            />

                            <div 
                                className="map-container" 
                                ref={mapRef}
                                tabIndex={0}
                                onKeyDown={handleKeyDown}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMoveOnMap}
                                touch-action="none"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onClick={isCalibrating ? handleCalibrationMapClick : undefined}
                                style={{ cursor: isCalibrating ? (isDragging ? 'grabbing' : 'crosshair') : (isDragging ? 'grabbing' : 'grab'), outline: 'none' }}
                                aria-label="Interactive Map of India"
                            >
                                <div style={{ 
                                    transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.k})`, 
                                    transformOrigin: '0 0',
                                    width: '100%', height: '100%',
                                    transition: isDragging || isPinching ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}>
                                    <svg className="map-svg" viewBox="0 0 21000 29700" preserveAspectRatio="xMidYMid meet">
                                        <defs>
                                            <filter id="shadow-sm" x="-50%" y="-50%" width="200%" height="200%">
                                                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.3)" />
                                            </filter>
                                            <filter id="shadow-marker" x="-60%" y="-60%" width="220%" height="220%">
                                                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="rgba(15, 23, 42, 0.25)" />
                                            </filter>

                                            {/* Primary Jewel Gradient (Educational Teal) */}
                                            <linearGradient id="marker-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#0d9488" />
                                                <stop offset="100%" stopColor="#004d40" />
                                            </linearGradient>

                                            {/* Active Jewel Gradient (Vibrant Amber / Gold) */}
                                            <linearGradient id="marker-grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#fbbf24" />
                                                <stop offset="100%" stopColor="#d97706" />
                                            </linearGradient>

                                            {/* Success Jewel Gradient (Emerald) */}
                                            <linearGradient id="marker-grad-success" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#34d399" />
                                                <stop offset="100%" stopColor="#059669" />
                                            </linearGradient>

                                            {/* Error Jewel Gradient (Rose / Coral) */}
                                            <linearGradient id="marker-grad-error" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#fb7185" />
                                                <stop offset="100%" stopColor="#e11d48" />
                                            </linearGradient>

                                            {/* Calibration Target Jewel Gradient (Studio Yellow) */}
                                            <linearGradient id="marker-grad-calib" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#fde047" />
                                                <stop offset="100%" stopColor="#ca8a04" />
                                            </linearGradient>
                                        </defs>
                                        <IndiaMapBackground />

                                        {/* Layer 1: Markers */}
                                        <MarkersLayer 
                                            locations={activeSet.locations}
                                            mode={mode}
                                            quizTarget={quizTarget}
                                            activeLocationName={activeLocationName}
                                            isCalibrating={isCalibrating}
                                            calibrationTargetIndex={calibrationTargetIndex}
                                            activeCatIndex={activeCatIndex}
                                            quizActive={quizActive}
                                            quizFeedback={quizFeedback}
                                            wrongLocation={wrongLocation}
                                            markerScale={markerScale}
                                            handleMapClick={handleMarkerClick}
                                            handleMapDoubleClick={(loc: MapLocation) => setInfoModalData({ ...loc, icon: activeSet.icon })}
                                            setActiveLocationName={setActiveLocationName}
                                            onMarkerDragStart={handleMarkerDragStart}
                                        />

                                        {/* Layer 2: Labels (with Anti-Collision Placement & Leader Lines) */}
                                        <LabelsLayer 
                                            locations={activeSet.locations}
                                            mode={mode}
                                            quizTarget={quizTarget}
                                            activeLocationName={activeLocationName}
                                            isCalibrating={isCalibrating}
                                            calibrationTargetIndex={calibrationTargetIndex}
                                            activeCatIndex={activeCatIndex}
                                            quizFeedback={quizFeedback}
                                            wrongLocation={wrongLocation}
                                            isZoomedIn={viewState.k >= 1.6}
                                            labelScale={labelScale}
                                            onLabelClick={handleMarkerClick}
                                            setActiveLocationName={setActiveLocationName}
                                        />
                                    </svg>
                                </div>
                                
                                {isCalibrating && (
                                    <div className="calib-desktop-only">
                                        <CursorCoordsBadge coords={hoverSvgCoords} zoomLevel={viewState.k} />
                                    </div>
                                )}

                                {isCalibrating && isAddingPin && (
                                    <div className="calib-desktop-only">
                                        <AddPinBanner onCancel={() => setIsAddingPin(false)} />
                                    </div>
                                )}

                                <CountdownOverlay count={countdownVal} />
                            </div>

                            {/* Floating Quiz Target & Feedback HUD (Unified, Non-Jumping) */}
                            {mode === 'quiz' && quizTarget && !countdownVal && !isCalibrating && (
                                <div 
                                    className={`quiz-hud-target-card ${quizFeedback !== 'none' ? `feedback-${quizFeedback}` : ''}`} 
                                    role="region" 
                                    aria-label="Active Quiz Target"
                                >
                                    {quizFeedback === 'none' ? (
                                        <div className="target-hud-content">
                                            <div className="target-hud-main">
                                                <span className="target-hud-kicker">Locate on Map</span>
                                                <div className="target-hud-title-row">
                                                    <strong className="target-hud-name">{quizTarget.name}</strong>
                                                    {hintRevealed && (
                                                        <span className="target-hud-hint-badge">
                                                            <i className="fas fa-map-marker-alt"></i> {quizTarget.state}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="target-hud-actions">
                                                {!hintRevealed ? (
                                                    <button 
                                                        className="target-hud-btn hint" 
                                                        onClick={handleUseHint} 
                                                        disabled={quizLocked}
                                                        title="State Hint (-10 pts)"
                                                    >
                                                        <i className="far fa-lightbulb"></i> Hint
                                                    </button>
                                                ) : (
                                                    <span className="target-hud-hint-active" title="Hint Revealed">
                                                        <i className="fas fa-check"></i> State Shown
                                                    </span>
                                                )}
                                                <button 
                                                    className="target-hud-btn skip" 
                                                    onClick={skipQuestion} 
                                                    disabled={quizLocked}
                                                    title="Skip Question"
                                                >
                                                    Skip <i className="fas fa-chevron-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`target-hud-feedback ${quizFeedback}`} role={quizFeedback === 'wrong' ? 'alert' : 'status'}>
                                            <div className="feedback-icon-wrap">
                                                <i className={`fas ${quizFeedback === 'correct' ? 'fa-check-circle' : 'fa-compass'}`}></i>
                                            </div>
                                            <div className="feedback-body">
                                                {quizFeedback === 'correct' ? (
                                                    <>
                                                        <strong>Correct!</strong>
                                                        <span>{quizTarget.name} ({quizTarget.state})</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>Target Location</strong>
                                                        <span>
                                                            {lastClickedLocation 
                                                                ? <>Tapped <strong>{lastClickedLocation.name}</strong> ({lastClickedLocation.state}) &bull; Target is in <strong>{quizTarget.state}</strong></> 
                                                                : <>Target <strong>{quizTarget.name}</strong> is in <strong>{quizTarget.state}</strong></>}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            {quizFeedback === 'correct' && (
                                                <span className="feedback-pts-badge">+10 pts</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Desktop Calibration Suite (hidden on mobile via CSS) */}
                            <div className="calib-desktop-only">
                                {isCalibrating && (
                                    <CalibFloatingToolbar 
                                        categories={calibratedMapData}
                                        activeCategoryIndex={activeCatIndex}
                                        onSelectCategoryIndex={handleSelectCategoryIndex}
                                        isAddingPin={isAddingPin}
                                        onToggleAddPin={() => setIsAddingPin(prev => !prev)}
                                        canUndo={historyIndex > 0}
                                        canRedo={historyIndex < history.length - 1}
                                        onUndo={handleUndo}
                                        onRedo={handleRedo}
                                        onOpenExport={() => setIsExportModalOpen(true)}
                                        onResetData={handleResetData}
                                        hasActivePin={Boolean(calibrationTargetIndex)}
                                        onExit={() => {
                                            setIsCalibrating(false);
                                            setIsAddingPin(false);
                                            setCalibrationTargetIndex(null);
                                        }}
                                    />
                                )}

                                {isCalibrating && calibrationTargetIndex && activeSet.locations[calibrationTargetIndex.locIndex] && (
                                    <CalibInspectorCard 
                                        location={activeSet.locations[calibrationTargetIndex.locIndex]}
                                        currentIndex={calibrationTargetIndex.locIndex}
                                        totalLocations={activeSet.locations.length}
                                        nudgeStep={nudgeStep}
                                        onChangeNudgeStep={setNudgeStep}
                                        onUpdateLocation={handleUpdateSelectedLocation}
                                        onNudge={handleNudgeLocation}
                                        onFocusLocation={handleCenterSelectedLocation}
                                        onDuplicateLocation={handleDuplicateSelectedLocation}
                                        onDeleteLocation={handleDeleteSelectedLocation}
                                        onClose={() => setCalibrationTargetIndex(null)}
                                        onPrevious={handlePreviousLocation}
                                        onNext={handleNextLocation}
                                        hasPrevious={calibrationTargetIndex.locIndex > 0}
                                        hasNext={calibrationTargetIndex.locIndex < activeSet.locations.length - 1}
                                    />
                                )}
                            </div>

                            {/* Mobile Calibration Suite (hidden on desktop via CSS) */}
                            <div className="calib-mobile-only">
                                {isCalibrating && (
                                    <MobileCalibSuite
                                        categories={calibratedMapData}
                                        activeCategoryIndex={activeCatIndex}
                                        onSelectCategoryIndex={handleSelectCategoryIndex}
                                        isAddingPin={isAddingPin}
                                        onToggleAddPin={() => setIsAddingPin(prev => !prev)}
                                        canUndo={historyIndex > 0}
                                        canRedo={historyIndex < history.length - 1}
                                        onUndo={handleUndo}
                                        onRedo={handleRedo}
                                        onOpenExport={() => setIsExportModalOpen(true)}
                                        onResetData={handleResetData}
                                        onExit={() => {
                                            setIsCalibrating(false);
                                            setIsAddingPin(false);
                                            setCalibrationTargetIndex(null);
                                        }}
                                        selectedLocation={calibrationTargetIndex && activeSet.locations[calibrationTargetIndex.locIndex] ? activeSet.locations[calibrationTargetIndex.locIndex] : null}
                                        currentIndex={calibrationTargetIndex ? calibrationTargetIndex.locIndex : 0}
                                        totalLocations={activeSet.locations.length}
                                        nudgeStep={nudgeStep}
                                        onChangeNudgeStep={setNudgeStep}
                                        onUpdateLocation={handleUpdateSelectedLocation}
                                        onNudge={handleNudgeLocation}
                                        onFocusLocation={handleCenterSelectedLocation}
                                        onDuplicateLocation={handleDuplicateSelectedLocation}
                                        onDeleteLocation={handleDeleteSelectedLocation}
                                        onCloseInspector={() => setCalibrationTargetIndex(null)}
                                        onPreviousLocation={handlePreviousLocation}
                                        onNextLocation={handleNextLocation}
                                        hasPrevious={calibrationTargetIndex ? calibrationTargetIndex.locIndex > 0 : false}
                                        hasNext={calibrationTargetIndex ? calibrationTargetIndex.locIndex < activeSet.locations.length - 1 : false}
                                        coords={hoverSvgCoords}
                                        zoomLevel={viewState.k}
                                        locations={activeSet.locations}
                                        onSelectLocationIndex={(locIndex) => setCalibrationTargetIndex({ catIndex: activeCatIndex, locIndex })}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Sidebar: Regular Locations List for Practice Mode */}
                        {mode === 'practice' && !isCalibrating && (
                            <aside className={`floating-sidebar ${isSidebarExpanded ? 'expanded' : ''}`} aria-label="Locations Sidebar">
                                <div className="sidebar-header" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
                                    <div className="sidebar-handle-container">
                                        <div className="sidebar-handle"></div>
                                    </div>
                                    <div className="sidebar-title-row">
                                        <div className="sidebar-title-group">
                                            <h2>Locations</h2>
                                            <span className="sidebar-subtitle">{activeSet.locations.length} items in {selectedCategory}</span>
                                        </div>
                                        <button 
                                            className={`sidebar-toggle-btn ${isSidebarExpanded ? 'rotated' : ''}`}
                                            aria-label="Toggle location sidebar"
                                            aria-expanded={isSidebarExpanded}
                                        >
                                            <i className="fas fa-chevron-up"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="sidebar-content">
                                    <div className="location-list" role="list">
                                        {activeSet.locations.map((loc, i) => (
                                            <div key={i} 
                                                 className={`location-card ${activeLocationName === loc.name ? 'active' : ''}`}
                                                 onClick={() => handlePracticeClick(loc)}
                                                 role="listitem"
                                                 tabIndex={0}
                                                 onKeyDown={(e) => {
                                                     if (e.key === 'Enter' || e.key === ' ') {
                                                         handlePracticeClick(loc);
                                                     }
                                                 }}
                                            >
                                                <div className="loc-icon">
                                                    <i className={`fas ${activeSet.icon}`}></i>
                                                </div>
                                                <div className="loc-info">
                                                    <span className="loc-name">{loc.name}</span>
                                                    <span className="loc-meta">
                                                        <i className="fas fa-map-pin"></i> {loc.state}
                                                    </span>
                                                </div>
                                                <div className="loc-actions">
                                                    <button 
                                                        className="info-btn-small" 
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            setInfoModalData({ ...loc, icon: activeSet.icon }); 
                                                        }} 
                                                        title="Show Details"
                                                        aria-label={`Show details for ${loc.name}`}
                                                    >
                                                        <i className="fas fa-info-circle"></i>
                                                    </button>
                                                    <i className="fas fa-crosshairs loc-arrow"></i>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        )}
                    </>
                ) : currentPage === 'downloads' ? (
                    <DownloadsPage downloadsData={downloadsData} />
                ) : currentPage === 'support' ? (
                    <SupportPage />
                ) : (
                    <InfoPage />
                )}
            </main>

            <CategoryModal 
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                categories={calibratedMapData}
                activeTitle={selectedCategory}
                onSelect={setSelectedCategory}
            />

            <QuizSummary 
                isOpen={isQuizSummaryOpen}
                onClose={handleSummaryClose}
                score={points}
                total={quizQueue.length}
                mistakes={quizMistakes}
                onRetry={handleSummaryRetry}
                onNextTopic={handleSummaryNextTopic}
            />

            <StudioExportImportModal 
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                mapData={calibratedMapData}
                onImportData={handleImportData}
            />

            <LocationInfoModal 
                isOpen={infoModalData !== null}
                onClose={() => setInfoModalData(null)}
                data={infoModalData}
            />
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
}