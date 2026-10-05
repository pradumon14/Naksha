import React, { useMemo } from 'react';
import { MapLocation } from '../types';
import { calculateLabelPlacements } from '../utils/labelCollision';

export interface MarkersLayerProps {
    locations: MapLocation[];
    mode: 'practice' | 'quiz';
    quizTarget: MapLocation | null;
    activeLocationName: string | null;
    isCalibrating: boolean;
    calibrationTargetIndex: { catIndex: number; locIndex: number } | null;
    activeCatIndex: number;
    quizActive: boolean;
    quizFeedback: 'none' | 'correct' | 'wrong';
    wrongLocation: { x: number; y: number } | null;
    markerScale: number;
    handleMapClick: (loc: MapLocation, locIndex?: number) => void;
    handleMapDoubleClick?: (loc: MapLocation) => void;
    setActiveLocationName: (name: string) => void;
    onMarkerDragStart?: (locIndex: number, e: React.MouseEvent) => void;
}

export const MarkersLayer = React.memo<MarkersLayerProps>(({ 
    locations, 
    mode, 
    quizTarget, 
    activeLocationName, 
    isCalibrating, 
    calibrationTargetIndex, 
    activeCatIndex, 
    quizActive, 
    quizFeedback, 
    wrongLocation, 
    markerScale, 
    handleMapClick,
    handleMapDoubleClick,
    setActiveLocationName,
    onMarkerDragStart
}) => {
    return (
        <>
            {locations.map((loc: MapLocation, idx: number) => {
                const isTarget = mode === 'quiz' && quizTarget !== null && quizTarget.name === loc.name;
                const isActive = activeLocationName === loc.name;
                const isCalibratingTarget = isCalibrating && calibrationTargetIndex?.catIndex === activeCatIndex && calibrationTargetIndex?.locIndex === idx;

                // Check if this marker is the wrong click feedback marker
                const isWrongFeedbackMarker = wrongLocation !== null && 
                    wrongLocation.x === loc.coords.x && 
                    wrongLocation.y === loc.coords.y;

                // Hide markers in quiz unless revealed during feedback
                const isHiddenInQuiz = mode === 'quiz' && 
                    quizActive && 
                    !(quizFeedback === 'wrong' && isTarget) && 
                    !(quizFeedback === 'wrong' && isWrongFeedbackMarker) &&
                    !(quizFeedback === 'correct' && isTarget);

                // Determine dynamic fill for gradient core
                const coreFill = isCalibratingTarget
                    ? 'url(#marker-grad-calib)'
                    : (mode === 'quiz' && quizFeedback === 'wrong' && isTarget)
                        ? 'url(#marker-grad-success)'
                        : (mode === 'quiz' && quizFeedback === 'wrong' && isWrongFeedbackMarker)
                            ? 'url(#marker-grad-error)'
                            : (mode === 'quiz' && quizFeedback === 'correct' && isTarget)
                                ? 'url(#marker-grad-success)'
                                : (isActive ? 'url(#marker-grad-active)' : 'url(#marker-grad-primary)');

                // Determine casing border stroke
                const casingStroke = isWrongFeedbackMarker
                    ? '#f43f5e'
                    : (isTarget && quizFeedback === 'wrong'
                        ? '#10b981'
                        : isCalibratingTarget
                            ? '#eab308'
                            : (isActive ? '#f59e0b' : 'rgba(0, 105, 92, 0.22)'));

                return (
                    <g key={`marker-${loc.name}-${idx}`} 
                        transform={`translate(${loc.coords.x}, ${loc.coords.y}) scale(${markerScale})`}
                        onClick={(e) => { e.stopPropagation(); handleMapClick(loc, idx); }}
                        onDoubleClick={(e) => { e.stopPropagation(); if (handleMapDoubleClick) handleMapDoubleClick(loc); }}
                        onMouseDown={(e) => {
                            if (isCalibrating && onMarkerDragStart) {
                                e.stopPropagation();
                                onMarkerDragStart(idx, e);
                            }
                        }}
                        onMouseEnter={() => { if (mode === 'practice' && !isCalibrating) setActiveLocationName(loc.name); }}
                        className={`map-marker-group ${isTarget ? 'is-target' : ''} ${isActive ? 'is-active' : ''} ${isCalibratingTarget ? 'is-calibrating' : ''} ${isWrongFeedbackMarker ? 'is-wrong' : ''}`}
                        style={{ cursor: isCalibrating ? (isCalibratingTarget ? 'grab' : 'pointer') : 'pointer' }}
                        role="button"
                        aria-label={`Marker for ${loc.name}, ${loc.state}`}
                    >
                        {/* Enlarged invisible hit area for effortless touch & clicks */}
                        <circle r="26" fill="transparent" />
                        
                        {isHiddenInQuiz ? (
                            <circle r="5.5" className="marker-visual marker-quiz-hidden" fill="#94a3b8" stroke="none" style={{ opacity: 0.35 }} />
                        ) : (
                            <>
                                {/* 1. Ambient Glow Aura for discoverability & breathing animation */}
                                <circle r="14" className="marker-ambient-halo" />

                                {/* 2. Calibration Mode Target Pulsing Rings */}
                                {isCalibratingTarget && (
                                    <>
                                        <circle r="19" fill="rgba(250, 204, 21, 0.22)" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" />
                                        <circle r="13" fill="none" stroke="#facc15" strokeWidth="1.2" opacity="0.9" />
                                    </>
                                )}

                                {/* 3. Dual Concentric Radar Beacon Rings for Target Location on Mistake */}
                                {mode === 'quiz' && quizFeedback === 'wrong' && isTarget && (
                                    <>
                                        <circle r="16" className="beacon-pulse-outer" />
                                        <circle r="9" className="beacon-pulse-inner" />
                                    </>
                                )}

                                {/* 4. Subtle Ripple Ring on User Mistake Tap */}
                                {mode === 'quiz' && quizFeedback === 'wrong' && isWrongFeedbackMarker && (
                                    <circle r="12" className="mistake-ripple-ring" />
                                )}

                                {/* 5. Continuous Dual Ripple Waves for Active Location or Correct Answer */}
                                {(isActive || (mode === 'quiz' && quizFeedback === 'correct' && isTarget)) && (
                                    <>
                                        <circle r="11" className="marker-ripple-wave wave-1" />
                                        <circle r="11" className="marker-ripple-wave wave-2" />
                                    </>
                                )}

                                {/* 6. Clean Cartographic Point Dot */}
                                <g className="marker-visual" filter="url(#shadow-marker)">
                                    {/* Crisp Outer Ring */}
                                    <circle 
                                        r="8.5" 
                                        className="marker-casing" 
                                        fill="#ffffff" 
                                        stroke={casingStroke} 
                                        strokeWidth={isCalibratingTarget ? "2.2" : (isActive ? "2" : "1.2")} 
                                    />
                                    {/* Pure Smooth Circular Dot */}
                                    <circle 
                                        r="5.8" 
                                        className="marker-core" 
                                        fill={coreFill} 
                                    />
                                </g>
                            </>
                        )}
                    </g>
                );
            })}
        </>
    );
});

MarkersLayer.displayName = 'MarkersLayer';

export interface LabelsLayerProps {
    locations: MapLocation[];
    mode: 'practice' | 'quiz';
    quizTarget: MapLocation | null;
    activeLocationName: string | null;
    isCalibrating: boolean;
    calibrationTargetIndex?: { catIndex: number; locIndex: number } | null;
    activeCatIndex?: number;
    quizFeedback: 'none' | 'correct' | 'wrong';
    wrongLocation: { x: number; y: number } | null;
    isZoomedIn: boolean;
    labelScale: number;
    devLabelMode?: 'all' | 'selected' | 'off';
    onLabelClick?: (loc: MapLocation, locIndex?: number) => void;
    setActiveLocationName?: (name: string) => void;
}

export const LabelsLayer = React.memo<LabelsLayerProps>(({
    locations,
    mode,
    quizTarget,
    activeLocationName,
    isCalibrating,
    calibrationTargetIndex,
    activeCatIndex,
    quizFeedback,
    wrongLocation,
    isZoomedIn,
    labelScale,
    devLabelMode = 'all',
    onLabelClick,
    setActiveLocationName
}) => {
    // 1. Determine which locations should display labels
    const visibleIndices = useMemo(() => {
        const indices: number[] = [];
        locations.forEach((loc, idx) => {
            const isTarget = mode === 'quiz' && quizTarget !== null && quizTarget.name === loc.name;
            const isWrongFeedbackMarker = mode === 'quiz' && wrongLocation !== null &&
                wrongLocation.x === loc.coords.x &&
                wrongLocation.y === loc.coords.y;
            const isCalibratingTarget = isCalibrating && 
                calibrationTargetIndex?.catIndex === activeCatIndex && 
                calibrationTargetIndex?.locIndex === idx;

            let show = false;
            if (isCalibrating) {
                if (devLabelMode === 'off') {
                    show = false;
                } else if (devLabelMode === 'selected') {
                    show = isCalibratingTarget || activeLocationName === loc.name;
                } else {
                    show = true;
                }
            } else if (mode === 'quiz') {
                show = (quizFeedback === 'correct' && isTarget) || 
                       (quizFeedback === 'wrong' && (isTarget || isWrongFeedbackMarker));
            } else {
                show = activeLocationName === loc.name || isZoomedIn;
            }

            if (show) indices.push(idx);
        });
        return indices;
    }, [
        locations, 
        mode, 
        quizTarget, 
        wrongLocation, 
        isCalibrating, 
        calibrationTargetIndex, 
        activeCatIndex, 
        devLabelMode, 
        activeLocationName, 
        quizFeedback, 
        isZoomedIn
    ]);

    // 2. Compute non-overlapping collision-free label placements
    const placements = useMemo(() => {
        return calculateLabelPlacements(
            locations,
            visibleIndices,
            activeLocationName,
            quizTarget?.name || null,
            labelScale
        );
    }, [locations, visibleIndices, activeLocationName, quizTarget, labelScale]);

    // 3. Sort rendering order so active/target label is rendered LAST (on top of others)
    const sortedVisibleIndices = useMemo(() => {
        return [...visibleIndices].sort((a, b) => {
            const locA = locations[a];
            const locB = locations[b];
            const isPriorityA = locA.name === activeLocationName || (mode === 'quiz' && quizTarget?.name === locA.name);
            const isPriorityB = locB.name === activeLocationName || (mode === 'quiz' && quizTarget?.name === locB.name);
            if (isPriorityA && !isPriorityB) return 1;
            if (!isPriorityA && isPriorityB) return -1;
            return 0;
        });
    }, [visibleIndices, locations, activeLocationName, mode, quizTarget]);

    return (
        <>
            {sortedVisibleIndices.map((idx) => {
                const loc = locations[idx];
                const placed = placements.get(idx);
                if (!placed || !placed.visible) return null;

                const isTarget = mode === 'quiz' && quizTarget !== null && quizTarget.name === loc.name;
                const isWrongFeedbackMarker = mode === 'quiz' && wrongLocation !== null &&
                    wrongLocation.x === loc.coords.x &&
                    wrongLocation.y === loc.coords.y;
                const isCalibratingTarget = isCalibrating && 
                    calibrationTargetIndex?.catIndex === activeCatIndex && 
                    calibrationTargetIndex?.locIndex === idx;
                const isActive = activeLocationName === loc.name;

                const isTargetReveal = mode === 'quiz' && isTarget;
                const isWrongReveal = mode === 'quiz' && isWrongFeedbackMarker && quizFeedback === 'wrong';

                const foBox = placed.foreignObjectBox;

                return (
                    <g 
                        key={`label-${loc.name}-${idx}`} 
                        transform={`translate(${loc.coords.x}, ${loc.coords.y}) scale(${labelScale})`}
                        className={`map-label-group label-dir-${placed.dir} ${isActive ? 'is-active' : ''} ${isTargetReveal ? 'is-target' : ''} ${isWrongReveal ? 'is-wrong' : ''}`}
                        style={{ pointerEvents: 'none' }}
                    >
                        {/* Crisp SVG Leader Line for offset or diagonal placements */}
                        {placed.hasLeaderLine && (
                            <line 
                                x1={placed.leaderLine.x1} 
                                y1={placed.leaderLine.y1} 
                                x2={placed.leaderLine.x2} 
                                y2={placed.leaderLine.y2} 
                                className="map-label-leader-line"
                            />
                        )}

                        <foreignObject 
                            x={foBox.x} 
                            y={foBox.y} 
                            width={foBox.width} 
                            height={foBox.height} 
                            style={{ overflow: 'visible' }}
                        >
                            <div className={`map-label-wrapper align-${placed.dir}`}>
                                <div 
                                    className={`map-label-pill dir-${placed.dir} ${isTargetReveal ? 'quiz-reveal-target' : ''} ${isWrongReveal ? 'quiz-reveal-wrong' : ''} ${isCalibratingTarget ? 'calibration-target-label' : ''} ${isActive ? 'is-active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onLabelClick) onLabelClick(loc, idx);
                                    }}
                                    onMouseEnter={() => {
                                        if (mode === 'practice' && !isCalibrating && setActiveLocationName) {
                                            setActiveLocationName(loc.name);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Location label for ${loc.name}, ${loc.state}`}
                                >
                                    {/* Directional Caret Arrow pointing to the marker */}
                                    {!placed.hasLeaderLine && (
                                        <span className={`label-arrow arrow-${placed.dir}`} />
                                    )}

                                    {/* Status Badges & Indicators */}
                                    {isTargetReveal && quizFeedback === 'wrong' && (
                                        <span className="label-prefix-badge correct">
                                            <i className="fas fa-bullseye" style={{ marginRight: 4 }}></i>Target
                                        </span>
                                    )}
                                    {isWrongReveal && (
                                        <span className="label-prefix-badge wrong">
                                            <i className="fas fa-times" style={{ marginRight: 4 }}></i>Tapped
                                        </span>
                                    )}
                                    {isCalibratingTarget && (
                                        <span className="label-prefix-badge calib">PIN</span>
                                    )}
                                    {!isTargetReveal && !isWrongReveal && !isCalibratingTarget && (
                                        <span className={`label-status-dot ${isActive ? 'active' : ''}`} />
                                    )}

                                    {/* Location Name */}
                                    <span className="label-text-content">{loc.name}</span>
                                </div>
                            </div>
                        </foreignObject>
                    </g>
                );
            })}
        </>
    );
});

LabelsLayer.displayName = 'LabelsLayer';
