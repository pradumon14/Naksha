import React from 'react';
import { MapLocation } from '../types';

export const MarkersLayer = React.memo(({ 
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
}: any) => {
    return (
        <>
            {locations.map((loc: MapLocation, idx: number) => {
                const isTarget = mode === 'quiz' && quizTarget && quizTarget.name === loc.name;
                const isActive = activeLocationName === loc.name;
                const isCalibratingTarget = isCalibrating && calibrationTargetIndex?.catIndex === activeCatIndex && calibrationTargetIndex?.locIndex === idx;

                // Hide markers in quiz unless it's the one we got WRONG (feedback) or we need to show it
                const isHiddenInQuiz = mode === 'quiz' && quizActive && !(quizFeedback === 'wrong' && isTarget) && !(quizFeedback === 'wrong' && wrongLocation && wrongLocation.x === loc.coords.x);

                return (
                    <g key={`marker-${idx}`} 
                        transform={`translate(${loc.coords.x}, ${loc.coords.y}) scale(${markerScale})`}
                        onClick={(e) => { e.stopPropagation(); handleMapClick(loc); }}
                        onDoubleClick={(e) => { e.stopPropagation(); if(handleMapDoubleClick) handleMapDoubleClick(loc); }}
                        onMouseEnter={() => (mode === 'practice' && !isCalibrating) && setActiveLocationName(loc.name)}
                        className={`map-marker-group ${isTarget ? 'is-target' : ''} ${isActive ? 'is-active' : ''}`}
                        style={{cursor: isCalibrating ? 'default' : 'pointer'}}
                    >
                        {/* Hit area */}
                        <circle r="24" fill="transparent" />
                        
                        {isHiddenInQuiz ? (
                            <circle r="6" className="marker-visual" fill="#94a3b8" stroke="none" style={{opacity: 0.3}} />
                        ) : (
                            <>
                                {/* Pulse Ring for Active/Target */}
                                {(isActive || (mode === 'quiz' && quizFeedback === 'wrong' && isTarget) || isCalibratingTarget) && (
                                    <circle r="12" className="marker-pulse" />
                                )}

                                {/* Visual Marker Jewel */}
                                <g className="marker-visual" filter="url(#shadow-sm)">
                                    <circle r="10" fill="white" />
                                    <circle r="7" className="marker-core" fill={isCalibratingTarget ? 'var(--c-accent)' : (mode === 'quiz' && quizFeedback === 'wrong' && isTarget ? '#16a34a' : (mode === 'quiz' && quizFeedback === 'wrong' ? '#ef4444' : 'var(--c-primary)'))} />
                                </g>
                            </>
                        )}
                    </g>
                );
            })}
        </>
    );
});

export const LabelsLayer = React.memo(({
    locations,
    mode,
    quizTarget,
    activeLocationName,
    isCalibrating,
    quizFeedback,
    viewState,
    labelScale
}: any) => {
    return (
        <>
            {locations.map((loc: MapLocation, idx: number) => {
                const isZoomedIn = viewState.k > 2;
                const isTarget = mode === 'quiz' && quizTarget && quizTarget.name === loc.name;
                const showLabel = (mode === 'quiz' && !isCalibrating)
                    ? (quizFeedback !== 'none' && isTarget)
                    : (activeLocationName === loc.name || isZoomedIn || isCalibrating);

                if (!showLabel) return null;

                return (
                    <g key={`label-${idx}`} 
                        transform={`translate(${loc.coords.x}, ${loc.coords.y}) scale(${labelScale})`}
                        style={{pointerEvents: 'none'}}
                    >
                        <foreignObject x="-150" y="-60" width="300" height="60" style={{overflow: 'visible'}}>
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
