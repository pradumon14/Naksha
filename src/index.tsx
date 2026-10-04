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
    CalibrationExportModal, 
    QuizSummary, 
    CountdownOverlay 
} from './components/SharedComponents';
import { MapLocation } from './types';

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
        streak, countdownVal, setCountdownVal, wrongLocation, pointAnimation,
        initQuizSession, proceedToNextQuestion, handleMapClick: engineHandleMapClick,
        handleUseHint, skipQuestion, resetQuizState
    } = useQuizEngine();

    // Practice State
    const [activeLocationName, setActiveLocationName] = useState<string | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); 

    // Calibration State
    const [isCalibrating, setIsCalibrating] = useState(false);
    const [calibratedMapData, setCalibratedMapData] = useState(mapData);
    const [calibrationTargetIndex, setCalibrationTargetIndex] = useState<{ catIndex: number; locIndex: number } | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    // Info Modal State
    const [infoModalData, setInfoModalData] = useState<(MapLocation & { icon?: string }) | null>(null);
    
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
     * Updates the coordinates of the currently targeted location without heavy JSON clone.
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
    
        const { catIndex, locIndex } = calibrationTargetIndex;

        setCalibratedMapData(prevData => prevData.map((cat, cIdx) => {
            if (cIdx !== catIndex) return cat;
            return {
                ...cat,
                locations: cat.locations.map((loc, lIdx) => {
                    if (lIdx !== locIndex) return loc;
                    return { ...loc, coords: { x: newX, y: newY } };
                })
            };
        }));
    
        // Move to next item automatically
        const currentCategory = calibratedMapData[catIndex];
        if (locIndex + 1 < currentCategory.locations.length) {
            setCalibrationTargetIndex({ catIndex, locIndex: locIndex + 1 });
        } else {
            setCalibrationTargetIndex(null); // End of list
        }
    };

    const handleMapClick = useCallback((loc: MapLocation) => {
        if (mode !== 'quiz' || !quizActive || !quizTarget) {
            if (!isCalibrating) {
                handlePracticeClick(loc);
            }
            return;
        }
        engineHandleMapClick(loc);
    }, [mode, quizActive, quizTarget, isCalibrating, handlePracticeClick, engineHandleMapClick]);

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
                                <button 
                                    className="category-btn" 
                                    onClick={() => setIsCategoryModalOpen(true)}
                                    aria-label={`Select category. Currently selected: ${selectedCategory}`}
                                >
                                    <i className={`fas ${activeSet.icon}`}></i>
                                    <span>{selectedCategory}</span>
                                    <i className="fas fa-chevron-down"></i>
                                </button>
                                {!isCalibrating && (
                                    <div className="mode-switch" role="tablist" aria-label="Learning Mode">
                                        <button 
                                            className={`mode-btn ${mode === 'practice' ? 'active' : ''}`} 
                                            onClick={() => setMode('practice')}
                                            role="tab"
                                            aria-selected={mode === 'practice'}
                                        >
                                            Practice
                                        </button>
                                        <button 
                                            className={`mode-btn ${mode === 'quiz' ? 'active' : ''}`} 
                                            onClick={startQuiz}
                                            role="tab"
                                            aria-selected={mode === 'quiz'}
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
                                        <i className="fas fa-star" style={{ color: '#f59e0b' }}></i> {points}
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
                                onZoomOut={() => zoomAtCenter(1 / 1.2)} 
                                onReset={resetView} 
                                onShare={handleShare}
                            />

                            <div 
                                className="map-container" 
                                ref={mapRef}
                                tabIndex={0}
                                onKeyDown={handleKeyDown}
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onClick={isCalibrating ? handleCalibrationMapClick : undefined}
                                style={{ cursor: isCalibrating ? 'crosshair' : (isDragging ? 'grabbing' : 'grab'), outline: 'none' }}
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
                                            handleMapClick={handleMapClick}
                                            handleMapDoubleClick={(loc: MapLocation) => setInfoModalData({ ...loc, icon: activeSet.icon })}
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
                                            isZoomedIn={viewState.k > 2}
                                            labelScale={labelScale}
                                        />
                                    </svg>
                                </div>
                                
                                <CountdownOverlay count={countdownVal} />

                                {quizFeedback !== 'none' && (
                                    <div className={`feedback-toast ${quizFeedback}`} role="status" aria-live="polite">
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
                                <div className="quiz-hud-floating-v3" role="region" aria-label="Active Quiz Target">
                                    <div className="quiz-hud-progress-bar-v3">
                                        <div 
                                            className="quiz-hud-progress-fill-v3" 
                                            style={{ width: `${((currentQuestionIndex + 1) / Math.max(1, quizQueue.length)) * 100}%` }}
                                        ></div>
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
                                                <button 
                                                    className="hud-btn-v3 hint-btn-v3" 
                                                    onClick={handleUseHint} 
                                                    disabled={quizLocked}
                                                    aria-label={`Get a hint for ${HINT_COST} points`}
                                                >
                                                    <i className="fas fa-lightbulb"></i> Hint <span className="hint-cost-v3">-{HINT_COST}</span>
                                                </button>
                                            )}
                                            <button 
                                                className="hud-btn-v3 skip-btn-v3" 
                                                onClick={skipQuestion} 
                                                disabled={quizLocked}
                                                aria-label="Skip question"
                                            >
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
                            <aside className={`floating-sidebar ${isSidebarExpanded ? 'expanded' : ''}`} aria-label="Locations Sidebar">
                                <div className="sidebar-header" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
                                    <div className="sidebar-handle-container">
                                        <div className="sidebar-handle"></div>
                                    </div>
                                    <div className="sidebar-title-row">
                                        <div className="sidebar-title-group">
                                            <h2>{isCalibrating ? 'Calibrate' : 'Locations'}</h2>
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
                                                     role="listitem"
                                                     tabIndex={0}
                                                     onKeyDown={(e) => {
                                                         if (e.key === 'Enter' || e.key === ' ') {
                                                             if (!isCalibrating) handlePracticeClick(loc);
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
                                                                aria-label={`Show details for ${loc.name}`}
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
                score={points}
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