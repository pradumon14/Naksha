import React from 'react';
import { MapLocation } from '../types';

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
    handleMapClick: (loc: MapLocation) => void;
    handleMapDoubleClick?: (loc: MapLocation) => void;
    setActiveLocationName: (name: string) => void;
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
    setActiveLocationName 
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

                // Hide markers in quiz unless it's the target (revealed on wrong answer) or the wrong location clicked
                const isHiddenInQuiz = mode === 'quiz' && 
                    quizActive && 
                    !(quizFeedback === 'wrong' && isTarget) && 
                    !(quizFeedback === 'wrong' && isWrongFeedbackMarker);

                return (
                    <g key={`marker-${loc.name}-${idx}`} 
                        transform={`translate(${loc.coords.x}, ${loc.coords.y}) scale(${markerScale})`}
                        onClick={(e) => { e.stopPropagation(); handleMapClick(loc); }}
                        onDoubleClick={(e) => { e.stopPropagation(); if (handleMapDoubleClick) handleMapDoubleClick(loc); }}
                        onMouseEnter={() => { if (mode === 'practice' && !isCalibrating) setActiveLocationName(loc.name); }}
                        className={`map-marker-group ${isTarget ? 'is-target' : ''} ${isActive ? 'is-active' : ''}`}
                        style={{ cursor: isCalibrating ? 'default' : 'pointer' }}
                        role="button"
                        aria-label={`Marker for ${loc.name}, ${loc.state}`}
                    >
                        {/* Enlarged hit area for easy touch/click */}
                        <circle r="24" fill="transparent" />
                        
                        {isHiddenInQuiz ? (
                            <circle r="6" className="marker-visual" fill="#94a3b8" stroke="none" style={{ opacity: 0.3 }} />
                        ) : (
                            <>
                                {/* Pulse Ring for Active/Target */}
                                {(isActive || (mode === 'quiz' && quizFeedback === 'wrong' && isTarget) || isCalibratingTarget) && (
                                    <circle r="12" className="marker-pulse" />
                                )}

                                {/* Visual Marker Jewel */}
                                <g className="marker-visual" filter="url(#shadow-sm)">
                                    <circle r="10" fill="white" />
                                    <circle 
                                        r="7" 
                                        className="marker-core" 
                                        fill={
                                            isCalibratingTarget 
                                                ? 'var(--c-accent)' 
                                                : (mode === 'quiz' && quizFeedback === 'wrong' && isTarget)
                                                    ? '#16a34a' 
                                                    : (mode === 'quiz' && quizFeedback === 'wrong' && isWrongFeedbackMarker)
                                                        ? '#ef4444' 
                                                        : 'var(--c-primary)'
                                        } 
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
    quizFeedback: 'none' | 'correct' | 'wrong';
    isZoomedIn: boolean;
    labelScale: number;
}

export const LabelsLayer = React.memo<LabelsLayerProps>(({
    locations,
    mode,
    quizTarget,
    activeLocationName,
    isCalibrating,
    quizFeedback,
    isZoomedIn,
    labelScale
}) => {
    return (
        <>
            {locations.map((loc: MapLocation, idx: number) => {
                const isTarget = mode === 'quiz' && quizTarget !== null && quizTarget.name === loc.name;
                const showLabel = (mode === 'quiz' && !isCalibrating)
                    ? (quizFeedback !== 'none' && isTarget)
                    : (activeLocationName === loc.name || isZoomedIn || isCalibrating);

                if (!showLabel) return null;

                return (
                    <g key={`label-${loc.name}-${idx}`} 
                        transform={`translate(${loc.coords.x}, ${loc.coords.y}) scale(${labelScale})`}
                        style={{ pointerEvents: 'none' }}
                    >
                        <foreignObject x="-150" y="-60" width="300" height="60" style={{ overflow: 'visible' }}>
                            <div className="map-label-wrapper">
                                <div className={`map-label-pill ${mode === 'quiz' && isTarget ? 'quiz-reveal' : ''}`}>
                                    {loc.name}
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
