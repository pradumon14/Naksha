import React, { useState, useEffect, useMemo, useRef, useLayoutEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { IndiaMapBackground } from '../IndiaMap.tsx';
import { Header } from './components/Header.tsx';
import { MapControls } from './components/MapControls.tsx';

import { mapData, downloadsData } from './data/data.ts';
import { useQuizEngine } from './hooks/useQuizEngine.ts';
import { LocationInfoModal } from './components/SharedComponents.tsx';
import { useMapZoom } from './hooks/useMapZoom.ts';
import { playSound } from './utils/index.ts';
import { InfoPage } from './components/InfoPage.tsx';
import { SupportPage } from './components/SupportPage.tsx';
import { MarkersLayer, LabelsLayer } from './components/MapLayers.tsx';
import { 
    DownloadsPage, 
    CategoryModal, 
    CalibrationExportModal, 
    QuizSummary, 
    CountdownOverlay 
} from './components/SharedComponents.tsx';

const App = () => {
    // Navigation State
    const [currentPage, setCurrentPage] = useState('map');
    
    // Map & Content State
    const [selectedCategory, setSelectedCategory] = useState(mapData[0].title);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [mode, setMode] = useState<'practice' | 'quiz'>('practice');
    
    // Map Viewport State
    const [viewState, setViewState] = useState({ k: 1, x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [mapWidth, setMapWidth] = useState(
        typeof window !== 'undefined' ? Math.min(window.innerWidth, 1200) : 1000
    );
    
    // Quiz State (from Hook)
    const {
        quizActive, setQuizActive, quizQueue, currentQuestionIndex, quizTarget, points, setPoints,
        quizFeedback, hintRevealed, quizLocked, quizMistakes, isQuizSummaryOpen, setIsQuizSummaryOpen,
        streak, countdownVal, setCountdownVal, wrongLocation, pointAnimation, setPointAnimation,
        initQuizSession, finishQuiz, proceedToNextQuestion, handleMapClick: engineHandleMapClick, handleUseHint, skipQuestion, resetQuizState
    } = useQuizEngine();

    // Practice State
    const [activeLocationName, setActiveLocationName] = useState<string | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); 

    // Calibration State
    const [isCalibrating, setIsCalibrating] = useState(false);
    const [calibratedMapData, setCalibratedMapData] = useState(mapData);
    const [calibrationTargetIndex, setCalibrationTargetIndex] = useState<{catIndex: number, locIndex: number} | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    // Info Modal State
    const [infoModalData, setInfoModalData] = useState<any>(null);

    // Refs
    const mapRef = useRef<HTMLDivElement>(null);
    const gestureRef = useRef({
        startDist: 0,
        startK: 1,
        startX: 0,
        startY: 0,
        centerX: 0,
        centerY: 0,
        isPinching: false
    });
    
    // Check for calibration mode on mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('calibrate') === 'true') {
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
    }, [countdownVal]);

    useLayoutEffect(() => {
        const observer = new ResizeObserver(entries => {
            for(let entry of entries) {
                if (entry.contentRect.width > 0) {
                    setMapWidth(entry.contentRect.width);
                }
            }
        });
        if(mapRef.current) observer.observe(mapRef.current);
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

    const startQuizSession = useCallback((locations: any[]) => {
        initQuizSession(locations);
        setViewState({ k: 1, x: 0, y: 0 });
        if (window.innerWidth < 768) {
            setIsSidebarExpanded(false); 
        }
    }, [initQuizSession]);

    useEffect(() => {
        if (isCalibrating) return; // Don't run this logic in calibration mode
        setActiveLocationName(null);
        
        if (mode === 'quiz') {
            startQuizSession(activeSet.locations);
        } else {
            resetQuizState();
            setViewState({ k: 1, x: 0, y: 0 });
        }
    }, [selectedCategory, mode, activeSet, startQuizSession, isCalibrating, resetQuizState]);

    useEffect(() => {
        if (quizActive) {
            setViewState({ k: 1, x: 0, y: 0 });
        }
    }, [currentQuestionIndex, quizActive]);

    /**
     * Smoothly zooms the map to a specific SVG coordinate.
     * @param {number} x - SVG X coordinate.
     * @param {number} y - SVG Y coordinate.
     */
    const zoomToLocation = (x: number, y: number) => {
        if (!mapRef.current) return;
        const container = mapRef.current.getBoundingClientRect();
        const svgW = 21000, svgH = 29700;
        const scaleX = container.width / svgW;
        const scaleY = container.height / svgH;
        const baseScale = Math.min(scaleX, scaleY);
        
        const targetK = 3; 
        const renderedW = svgW * baseScale;
        const renderedH = svgH * baseScale;
        const offsetX = (container.width - renderedW) / 2;
        const offsetY = (container.height - renderedH) / 2;
        
        const targetPx = (x * baseScale) + offsetX;
        const targetPy = (y * baseScale) + offsetY;
        
        const newX = (container.width / 2) - (targetPx * targetK);
        const newY = (container.height / 2) - (targetPy * targetK);
        
        setViewState({ k: targetK, x: newX, y: newY });
    };

    /**
     * Zooms the map relative to the current viewport center.
     * @param {number} factor - Zoom multiplier (e.g., 1.2 for zoom in, 0.8 for zoom out).
     */
    const zoomAtCenter = (factor: number) => {
        if (!mapRef.current) return;
        const rect = mapRef.current.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        
        setViewState(prev => {
            const newK = Math.min(Math.max(1, prev.k * factor), 8);
            const newX = cx - (cx - prev.x) * (newK / prev.k);
            const newY = cy - (cy - prev.y) * (newK / prev.k);
            return { k: newK, x: newX, y: newY };
        });
    };

    /**
     * Handles keyboard shortcuts for map navigation.
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        const step = 50; 
        if (e.key === 'ArrowUp') setViewState(v => ({ ...v, y: v.y + step }));
        if (e.key === 'ArrowDown') setViewState(v => ({ ...v, y: v.y - step }));
        if (e.key === 'ArrowLeft') setViewState(v => ({ ...v, x: v.x + step }));
        if (e.key === 'ArrowRight') setViewState(v => ({ ...v, x: v.x - step }));
        if (e.key === '=' || e.key === '+') zoomAtCenter(1.2);
        if (e.key === '-' || e.key === '_') zoomAtCenter(1/1.2);
    };

    /**
     * Triggers a floating point animation at the score display.
     * @param {number} val - The point value to animate (e.g., +100 or -20).
     */
    const animatePoints = (val: number) => {
        setPointAnimation({ val, id: Date.now() });
        setTimeout(() => setPointAnimation(null), 1000);
    };

    /**
     * Handles clicking a location in practice mode.
     * Zooms to the location and shows its label.
     */
    const handlePracticeClick = (loc: any) => {
        setActiveLocationName(loc.name);
        setIsSidebarExpanded(false); 
        zoomToLocation(loc.coords.x, loc.coords.y);
    };

    const startQuiz = () => {
        if (isCalibrating) return;
        setMode('quiz'); 
    };
    
    /**
     * Handles map clicks specifically for calibration mode.
     * Updates the coordinates of the currently targeted location.
     */
    const handleCalibrationMapClick = (e: React.MouseEvent) => {
        if (!isCalibrating || !calibrationTargetIndex || !mapRef.current) return;
    
        const svg = mapRef.current.querySelector('svg');
        if (!svg) return;
    
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
    
        const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    
        const newX = Math.round(svgP.x);
        const newY = Math.round(svgP.y);
    
        setCalibratedMapData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy
            const { catIndex, locIndex } = calibrationTargetIndex;
            newData[catIndex].locations[locIndex].coords = { x: newX, y: newY };
            return newData;
        });
    
        // Move to next item automatically
        const { catIndex, locIndex } = calibrationTargetIndex;
        const currentCategory = calibratedMapData[catIndex];
        if (locIndex + 1 < currentCategory.locations.length) {
            setCalibrationTargetIndex({ catIndex, locIndex: locIndex + 1 });
        } else {
            setCalibrationTargetIndex(null); // End of list
        }
    };


    const handleMapClick = (loc: any) => {
        if (mode !== 'quiz' || !quizActive || !quizTarget) {
            if (!isCalibrating) {
                handlePracticeClick(loc);
            }
            return;
        }
        engineHandleMapClick(loc);
    };

    const handleSummaryClose = () => {
        setIsQuizSummaryOpen(false);
        setMode('practice'); 
    };

    const handleSummaryRetry = () => {
        startQuiz(); 
        setIsQuizSummaryOpen(false);
    };

    const handleSummaryNextTopic = () => {
        setIsQuizSummaryOpen(false);
        const nextCatIndex = (activeCatIndex + 1) % calibratedMapData.length;
        setSelectedCategory(calibratedMapData[nextCatIndex].title);
        // Using setTimeout to wait for state flush before calling startQuiz again
        setTimeout(() => startQuiz(), 0);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (!mapRef.current) return;
        const scaleFactor = 0.0015;
        const scaleDelta = -e.deltaY * scaleFactor;
        const newK = Math.min(Math.max(1, viewState.k + scaleDelta), 8);
        const rect = mapRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const newX = mouseX - (mouseX - viewState.x) * (newK / viewState.k);
        const newY = mouseY - (mouseY - viewState.y) * (newK / viewState.k);
        setViewState({ k: newK, x: newX, y: newY });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - viewState.x, y: e.clientY - viewState.y });
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        setViewState(prev => ({ ...prev, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
    };
    const handleMouseUp = () => setIsDragging(false);
    
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            const t = e.touches[0];
            setDragStart({ x: t.clientX - viewState.x, y: t.clientY - viewState.y });
        } else if (e.touches.length === 2) {
            setIsDragging(false);
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            
            if (!mapRef.current) return;
            const rect = mapRef.current.getBoundingClientRect();
            const cx = (t1.clientX + t2.clientX) / 2 - rect.left;
            const cy = (t1.clientY + t2.clientY) / 2 - rect.top;

            gestureRef.current = {
                startDist: dist,
                startK: viewState.k,
                startX: viewState.x,
                startY: viewState.y,
                centerX: cx,
                centerY: cy,
                isPinching: true
            };
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 1 && isDragging) {
            const t = e.touches[0];
            setViewState(prev => ({ ...prev, x: t.clientX - dragStart.x, y: t.clientY - dragStart.y }));
        } else if (e.touches.length === 2 && gestureRef.current.isPinching) {
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const currDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            
            if (currDist < 10) return;

            const { startDist, startK, startX, startY, centerX, centerY } = gestureRef.current;
            const scale = currDist / startDist;
            const newK = Math.min(Math.max(1, startK * scale), 8);
            
            const newX = centerX - (centerX - startX) * (newK / startK);
            const newY = centerY - (centerY - startY) * (newK / startK);
            
            setViewState({ k: newK, x: newX, y: newY });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        gestureRef.current.isPinching = false;
    };

    const sessionScore = points; // Use raw points for better display

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Naksha - Interactive Geography',
                text: 'Practice map pointing for your exams with Naksha!',
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className={`app ${currentPage === 'map' ? 'map-view' : ''}`}>
             {isCalibrating && (
                <div className="calibration-banner">
                    <i className="fas fa-crosshairs"></i> Calibration Mode Active
                </div>
            )}
            <Header onNavigate={setCurrentPage} activePage={currentPage} />

            <main className="main-grid">
                {currentPage === 'map' ? (
                    <>
                        <div className="map-section">
                            <div className="controls-bar">
                                <button className="category-btn" onClick={() => setIsCategoryModalOpen(true)}>
                                    <i className={`fas ${activeSet.icon}`}></i>
                                    <span>{selectedCategory}</span>
                                    <i className="fas fa-chevron-down"></i>
                                </button>
                                {!isCalibrating && (
                                    <div className="mode-switch">
                                        <button 
                                            className={`mode-btn ${mode === 'practice' ? 'active' : ''}`} 
                                            onClick={() => { setMode('practice'); }}
                                        >
                                            Practice
                                        </button>
                                        <button 
                                            className={`mode-btn ${mode === 'quiz' ? 'active' : ''}`} 
                                            onClick={startQuiz}
                                        >
                                            Quiz
                                        </button>
                                    </div>
                                )}
                            </div>

                            {mode === 'quiz' && !isCalibrating && (
                                <div className="quiz-score-overlay floating-glass">
                                    {streak > 1 && (
                                        <div className="streak-display">
                                            <i className="fas fa-fire"></i> x{streak}
                                        </div>
                                    )}
                                    <div className="score-display">
                                        <i className="fas fa-star" style={{color: '#f59e0b'}}></i> {points}
                                        {pointAnimation && (
                                            <div key={pointAnimation.id} className={`point-float ${pointAnimation.val > 0 ? 'pos' : 'neg'}`}>
                                                {pointAnimation.val > 0 ? '+' : ''}{pointAnimation.val}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <MapControls 
                                onZoomIn={() => zoomAtCenter(1.2)} 
                                onZoomOut={() => zoomAtCenter(1/1.2)} 
                                onReset={() => setViewState({ k: 1, x: 0, y: 0 })} 
                                onShare={handleShare}
                            />

                            <div className="map-container" 
                                ref={mapRef}
                                tabIndex={0}
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onClick={isCalibrating ? handleCalibrationMapClick : undefined}
                                style={{cursor: isCalibrating ? 'crosshair' : 'grab', outline: 'none'}}
                            >
                                <div style={{ 
                                    transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.k})`, 
                                    transformOrigin: '0 0',
                                    width: '100%', height: '100%',
                                    transition: isDragging || gestureRef.current.isPinching ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}>
                                    <svg className="map-svg" viewBox="0 0 21000 29700" preserveAspectRatio="xMidYMid meet">
                                        <defs>
                                            <filter id="shadow-sm" x="-50%" y="-50%" width="200%" height="200%">
                                                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.3)" />
                                            </filter>
                                        </defs>
                                        <IndiaMapBackground />
                                        
                                        {/* Guidance Line for Wrong Answers */}
                                        {mode === 'quiz' && quizFeedback === 'wrong' && wrongLocation && quizTarget && (
                                            <line 
                                                x1={wrongLocation.x} 
                                                y1={wrongLocation.y} 
                                                x2={quizTarget.coords.x} 
                                                y2={quizTarget.coords.y} 
                                                stroke="#ef4444" 
                                                strokeWidth="40" 
                                                strokeDasharray="100, 50"
                                                className="guidance-line"
                                            />
                                        )}

                                        {/* Render Markers Layer */}
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
                                            handleMapClick={handleMapClick}
                                            handleMapDoubleClick={(loc: any) => setInfoModalData({ ...loc, icon: activeSet.icon })}
                                            setActiveLocationName={setActiveLocationName}
                                        />

                                        {/* Layer 2: Labels */}
                                        <LabelsLayer 
                                            locations={activeSet.locations}
                                            mode={mode}
                                            quizTarget={quizTarget}
                                            activeLocationName={activeLocationName}
                                            isCalibrating={isCalibrating}
                                            quizFeedback={quizFeedback}
                                            viewState={viewState}
                                            labelScale={labelScale}
                                        />
                                    </svg>
                                </div>
                                
                                <CountdownOverlay count={countdownVal} />

                                {quizFeedback !== 'none' && (
                                    <div className={`feedback-toast ${quizFeedback}`}>
                                        {quizFeedback === 'correct' ? (
                                            <><i className="fas fa-check-circle"></i> Correct!</>
                                        ) : (
                                            <><i className="fas fa-times-circle"></i> Wrong!</>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Floating Quiz HUD */}
                            {mode === 'quiz' && quizTarget && !countdownVal && !isCalibrating && (
                                <div className="quiz-hud-floating-v3">
                                    <div className="quiz-hud-progress-bar-v3">
                                        <div className="quiz-hud-progress-fill-v3" style={{width: `${((currentQuestionIndex + 1) / quizQueue.length) * 100}%`}}></div>
                                    </div>
                                    
                                    <div className="quiz-hud-content-v3">
                                        <div className="quiz-hud-top-v3">
                                            <span className="quiz-hud-badge-v3">
                                                <i className="fas fa-map-marker-alt"></i> Question {currentQuestionIndex + 1}/{quizQueue.length}
                                            </span>
                                        </div>
                                        
                                        <div className="quiz-hud-target-group-v3">
                                            <span className="quiz-hud-label-v3">Locate on Map</span>
                                            <h2 className="quiz-hud-target-name-v3">{quizTarget.name}</h2>
                                        </div>

                                        <div className="quiz-hud-actions-v3">
                                            {hintRevealed ? (
                                                <div className="hud-btn-v3 hint-active-v3" style={{ flexDirection: 'column', padding: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Located in</span>
                                                    <strong style={{ fontSize: '0.9rem' }}>{quizTarget.state}</strong>
                                                </div>
                                            ) : (
                                                <button className="hud-btn-v3 hint-btn-v3" onClick={handleUseHint} disabled={quizLocked}>
                                                    <i className="fas fa-lightbulb"></i> Hint <span className="hint-cost-v3">-20</span>
                                                </button>
                                            )}
                                            <button className="hud-btn-v3 skip-btn-v3" onClick={skipQuestion} disabled={quizLocked}>
                                                Skip <i className="fas fa-forward"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isCalibrating && (
                                <button className="calibration-export-btn" onClick={() => setIsExportModalOpen(true)}>
                                    <i className="fas fa-file-export"></i> Export Data
                                </button>
                            )}
                        </div>

                        {/* Sidebar only for Practice List or Calibration */}
                        {(mode === 'practice' || isCalibrating) && (
                            <aside className={`floating-sidebar ${isSidebarExpanded ? 'expanded' : ''}`}>
                                <div className="sidebar-header" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
                                    <div className="sidebar-handle-container">
                                        <div className="sidebar-handle"></div>
                                    </div>
                                    <div className="sidebar-title-row">
                                        <div className="sidebar-title-group">
                                            <h2>{isCalibrating ? 'Calibrate' : 'Locations'}</h2>
                                            <span className="sidebar-subtitle">{activeSet.locations.length} items in {selectedCategory}</span>
                                        </div>
                                        <button className={`sidebar-toggle-btn ${isSidebarExpanded ? 'rotated' : ''}`}>
                                            <i className="fas fa-chevron-up"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="sidebar-content">
                                    <div className="location-list">
                                        {activeSet.locations.map((loc, i) => {
                                            const isCalibratingTarget = isCalibrating && calibrationTargetIndex?.catIndex === activeCatIndex && calibrationTargetIndex?.locIndex === i;
                                            return (
                                                <div key={i} 
                                                     className={`location-card ${activeLocationName === loc.name ? 'active' : ''} ${isCalibratingTarget ? 'calibrating' : ''}`}
                                                     onClick={() => {
                                                         if (isCalibrating) {
                                                             setCalibrationTargetIndex({ catIndex: activeCatIndex, locIndex: i });
                                                         } else {
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
                                                            {isCalibrating ? `x: ${loc.coords.x}, y: ${loc.coords.y}` : <><i className="fas fa-map-pin"></i> {loc.state}</>}
                                                        </span>
                                                    </div>
                                                    {!isCalibrating && (
                                                        <div className="loc-actions">
                                                            <button 
                                                                className="info-btn-small" 
                                                                onClick={(e) => { 
                                                                    e.stopPropagation(); 
                                                                    setInfoModalData({ ...loc, icon: activeSet.icon }); 
                                                                }} 
                                                                title="Show Details"
                                                            >
                                                                <i className="fas fa-info-circle"></i>
                                                            </button>
                                                            <i className="fas fa-crosshairs loc-arrow"></i>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
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
                score={sessionScore}
                total={quizQueue.length}
                mistakes={quizMistakes}
                onRetry={handleSummaryRetry}
                onNextTopic={handleSummaryNextTopic}
            />

            <CalibrationExportModal 
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                data={calibratedMapData}
            />

            <LocationInfoModal 
                isOpen={!!infoModalData}
                onClose={() => setInfoModalData(null)}
                data={infoModalData}
            />
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);