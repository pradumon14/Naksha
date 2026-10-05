import React, { useState, useMemo, useEffect } from 'react';
import { MapCategory, MapLocation } from '../types';

/**
 * Clean Coordinates Badge (Bottom-Left of Map).
 * Features a subtle yellow accent tag.
 */
export const CursorCoordsBadge: React.FC<{
    coords: { x: number; y: number } | null;
    zoomLevel: number;
}> = ({ coords, zoomLevel }) => {
    return (
        <div className="calib-coords-badge" aria-live="polite">
            <span className="badge-coords-val">
                {coords ? `X: ${coords.x}  Y: ${coords.y}` : 'X: —  Y: —'}
            </span>
            <span className="badge-zoom-tag">{zoomLevel.toFixed(1)}x</span>
        </div>
    );
};

/**
 * Floating Banner when "Add Pin Mode" is active.
 * Uses high-visibility yellow alert styling.
 */
export const AddPinBanner: React.FC<{
    onCancel: () => void;
}> = ({ onCancel }) => {
    return (
        <div className="calib-add-pin-banner" role="status">
            <div className="banner-content-wrap">
                <span className="banner-pin-badge">
                    <i className="fas fa-map-pin"></i>
                </span>
                <span className="banner-text">
                    <strong>Add Pin:</strong> <span className="banner-text-desktop">Click anywhere on the map</span><span className="banner-text-mobile">Tap map to place</span>
                </span>
            </div>
            <button className="banner-cancel-pill" onClick={onCancel} title="Cancel (Esc)">
                <span className="cancel-label">Cancel</span> <i className="fas fa-times"></i>
            </button>
        </div>
    );
};

/**
 * Floating Toolbar for Calibration Mode.
 * Elevated white dock with vivid yellow accent elements.
 */
export const CalibFloatingToolbar: React.FC<{
    categories: MapCategory[];
    activeCategoryIndex: number;
    onSelectCategoryIndex: (index: number) => void;
    isAddingPin: boolean;
    onToggleAddPin: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onOpenExport: () => void;
    onResetData: () => void;
    onExit: () => void;
    hasActivePin?: boolean;
}> = ({
    categories,
    activeCategoryIndex,
    onSelectCategoryIndex,
    isAddingPin,
    onToggleAddPin,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onOpenExport,
    onResetData,
    onExit,
    hasActivePin
}) => {
    return (
        <div className={`calib-bottom-dock ${hasActivePin ? 'has-active-pin' : ''}`} role="region" aria-label="Calibration Controls">
            {/* Yellow Accent Badge */}
            <div className="toolbar-brand-tag" title="Calibration Mode">
                <i className="fas fa-crosshairs"></i>
                <span className="brand-label">CALIBRATE</span>
            </div>

            <div className="dock-separator"></div>

            <div className="dock-category-wrap">
                <select 
                    className="dock-category-select"
                    value={activeCategoryIndex}
                    onChange={(e) => onSelectCategoryIndex(parseInt(e.target.value, 10))}
                    aria-label="Select Category"
                >
                    {categories.map((cat, idx) => (
                        <option key={idx} value={idx}>{cat.title}</option>
                    ))}
                </select>
            </div>

            <button 
                className={`dock-add-pin-btn ${isAddingPin ? 'active' : ''}`}
                onClick={onToggleAddPin}
                title={isAddingPin ? 'Cancel adding pin (Esc)' : 'Add new pin (N key)'}
            >
                <i className={`fas ${isAddingPin ? 'fa-times' : 'fa-plus'}`}></i>
                <span className="add-pin-label">{isAddingPin ? 'Cancel' : 'Add Pin'}</span>
            </button>

            <div className="dock-separator"></div>

            <div className="dock-actions-row">
                <button 
                    className={`dock-circle-btn ${canUndo ? '' : 'disabled'}`}
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                    aria-label="Undo"
                >
                    <i className="fas fa-undo"></i>
                </button>
                <button 
                    className={`dock-circle-btn ${canRedo ? '' : 'disabled'}`}
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Y)"
                    aria-label="Redo"
                >
                    <i className="fas fa-redo"></i>
                </button>
                <button 
                    className="dock-circle-btn"
                    onClick={onOpenExport}
                    title="Export or Import Dataset"
                    aria-label="Export or Import Dataset"
                >
                    <i className="fas fa-file-export"></i>
                </button>
                <button 
                    className="dock-circle-btn text-danger"
                    onClick={onResetData}
                    title="Reset to syllabus defaults"
                    aria-label="Reset to syllabus defaults"
                >
                    <i className="fas fa-undo-alt"></i>
                </button>
            </div>

            <div className="dock-separator"></div>

            <button 
                className="dock-close-pill" 
                onClick={onExit}
                title="Exit Calibration Mode"
                aria-label="Exit Calibration"
            >
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};

/**
 * Mobile-Specific Top Calibration Header Pill.
 * Floating frosted glass pill consistent with the quiz mode top HUD (.quiz-hud-top-minimal).
 */
export const MobileCalibTopBar: React.FC<{
    categories: MapCategory[];
    activeCategoryIndex: number;
    onSelectCategoryIndex: (index: number) => void;
    isAddingPin: boolean;
    onCancelAddPin: () => void;
    onExit: () => void;
}> = ({
    categories,
    activeCategoryIndex,
    onSelectCategoryIndex,
    isAddingPin,
    onCancelAddPin,
    onExit
}) => {
    const activeCat = categories[activeCategoryIndex] || categories[0];

    if (isAddingPin) {
        return (
            <div className="calib-mobile-top-pill is-adding" role="status">
                <div className="mobile-pill-left">
                    <span className="mobile-pill-pin-pulse">
                        <i className="fas fa-map-pin"></i>
                    </span>
                    <span className="mobile-pill-title">Tap map to place pin</span>
                </div>
                <button 
                    className="mobile-pill-cancel-btn" 
                    onClick={onCancelAddPin} 
                    title="Cancel adding pin"
                    aria-label="Cancel adding pin"
                >
                    <span>Cancel</span>
                    <i className="fas fa-times"></i>
                </button>
            </div>
        );
    }

    return (
        <div className="calib-mobile-top-pill" role="region" aria-label="Calibration Status">
            <div className="mobile-pill-tag" title="Calibration Mode Active">
                <i className="fas fa-crosshairs"></i>
                <span>CALIBRATE</span>
            </div>

            <div className="mobile-pill-divider"></div>

            <div className="mobile-pill-category-select-wrap">
                <i className={`fas ${activeCat?.icon || 'fa-map-marker-alt'} mobile-pill-cat-icon`}></i>
                <select
                    className="mobile-pill-category-select"
                    value={activeCategoryIndex}
                    onChange={(e) => onSelectCategoryIndex(parseInt(e.target.value, 10))}
                    aria-label="Select Calibration Category"
                >
                    {categories.map((cat, idx) => (
                        <option key={idx} value={idx}>{cat.title}</option>
                    ))}
                </select>
                <i className="fas fa-chevron-down mobile-pill-chevron"></i>
            </div>

            <div className="mobile-pill-divider"></div>

            <button 
                className="mobile-pill-exit-btn" 
                onClick={onExit} 
                title="Exit Calibration Mode" 
                aria-label="Exit Calibration"
            >
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};

/**
 * Mobile-Specific Bottom Calibration Dock.
 * Displayed when no pin is being inspected.
 * Features a bold yellow "+ Add Pin" button and touch-friendly controls.
 */
export const MobileCalibBottomDock: React.FC<{
    totalLocations: number;
    isAddingPin: boolean;
    onToggleAddPin: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onOpenExport: () => void;
    onResetData: () => void;
}> = ({
    totalLocations,
    isAddingPin,
    onToggleAddPin,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onOpenExport,
    onResetData
}) => {
    return (
        <div className="calib-mobile-dock" role="region" aria-label="Calibration Controls">
            <button 
                className={`mobile-dock-add-btn ${isAddingPin ? 'active' : ''}`}
                onClick={onToggleAddPin}
                aria-label={isAddingPin ? 'Cancel adding pin' : 'Add new pin'}
            >
                <i className={`fas ${isAddingPin ? 'fa-times' : 'fa-plus'}`}></i>
                <span>{isAddingPin ? 'Cancel' : 'Add Pin'}</span>
            </button>

            <div className="mobile-dock-counter-pill" title="Total pins in category">
                <i className="fas fa-map-marker-alt"></i>
                <span>{totalLocations} Pins</span>
            </div>

            <div className="mobile-dock-quick-actions">
                <button 
                    className={`mobile-dock-btn ${canUndo ? '' : 'disabled'}`}
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Undo"
                    aria-label="Undo"
                >
                    <i className="fas fa-undo"></i>
                </button>
                <button 
                    className={`mobile-dock-btn ${canRedo ? '' : 'disabled'}`}
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Redo"
                    aria-label="Redo"
                >
                    <i className="fas fa-redo"></i>
                </button>
                <button 
                    className="mobile-dock-btn"
                    onClick={onOpenExport}
                    title="Export or Import"
                    aria-label="Export or Import"
                >
                    <i className="fas fa-file-export"></i>
                </button>
                <button 
                    className="mobile-dock-btn text-danger"
                    onClick={onResetData}
                    title="Reset syllabus defaults"
                    aria-label="Reset Defaults"
                >
                    <i className="fas fa-undo-alt"></i>
                </button>
            </div>
        </div>
    );
};

/**
 * Mobile-Specific Calibration Inspector Sheet.
 * Bottom sheet designed consistent with .quiz-hud-target-card.
 * Features a pull handle for compact/full toggle, thumb-friendly D-pad, and direct steppers.
 */
export const MobileCalibInspectorSheet: React.FC<{
    location: MapLocation;
    currentIndex: number;
    totalLocations: number;
    nudgeStep: number;
    onChangeNudgeStep: (step: number) => void;
    onUpdateLocation: (updated: Partial<MapLocation>) => void;
    onNudge: (dx: number, dy: number) => void;
    onFocusLocation: () => void;
    onDuplicateLocation: () => void;
    onDeleteLocation: () => void;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
}> = ({
    location,
    currentIndex,
    totalLocations,
    nudgeStep,
    onChangeNudgeStep,
    onUpdateLocation,
    onNudge,
    onFocusLocation,
    onDuplicateLocation,
    onDeleteLocation,
    onClose,
    onPrevious,
    onNext,
    hasPrevious,
    hasNext
}) => {
    const [isCompact, setIsCompact] = useState(false);
    const [activeTab, setActiveTab] = useState<'coords' | 'details'>('coords');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [xText, setXText] = useState(String(location.coords.x));
    const [yText, setYText] = useState(String(location.coords.y));

    useEffect(() => {
        setXText(String(location.coords.x));
        setYText(String(location.coords.y));
    }, [location.coords.x, location.coords.y]);

    useEffect(() => {
        setShowDeleteConfirm(false);
    }, [location]);

    const handleXChange = (valStr: string) => {
        setXText(valStr);
        const parsed = parseInt(valStr, 10);
        if (!isNaN(parsed)) {
            onUpdateLocation({ coords: { ...location.coords, x: parsed } });
        }
    };

    const handleXBlur = () => {
        const parsed = parseInt(xText, 10);
        if (isNaN(parsed)) {
            setXText(String(location.coords.x));
        }
    };

    const handleYChange = (valStr: string) => {
        setYText(valStr);
        const parsed = parseInt(valStr, 10);
        if (!isNaN(parsed)) {
            onUpdateLocation({ coords: { ...location.coords, y: parsed } });
        }
    };

    const handleYBlur = () => {
        const parsed = parseInt(yText, 10);
        if (isNaN(parsed)) {
            setYText(String(location.coords.y));
        }
    };

    return (
        <div className={`calib-mobile-sheet ${isCompact ? 'is-compact' : ''}`} role="region" aria-label="Pin Inspector">
            {/* Tactile Drag Handle */}
            <div 
                className="calib-mobile-sheet-handle" 
                onClick={() => setIsCompact(prev => !prev)}
                title={isCompact ? "Expand Inspector" : "Collapse to Mini Mode"}
            >
                <div className="sheet-handle-bar"></div>
            </div>

            {/* Header: Pin Badge, Title, Prev/Next, Collapse, Close */}
            <div className="mobile-sheet-header">
                <div className="mobile-sheet-title-col">
                    <span className="mobile-sheet-pin-tag">
                        <i className="fas fa-map-pin"></i> Pin #{currentIndex + 1}
                    </span>
                    <h3 className="mobile-sheet-title" title={location.name}>
                        {location.name || 'Unnamed Location'}
                    </h3>
                </div>

                <div className="mobile-sheet-nav-actions">
                    <button 
                        className="mobile-sheet-icon-btn" 
                        onClick={onPrevious} 
                        disabled={!hasPrevious}
                        title="Previous Pin"
                        aria-label="Previous Pin"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="mobile-sheet-counter">
                        {currentIndex + 1}/{totalLocations}
                    </span>
                    <button 
                        className="mobile-sheet-icon-btn" 
                        onClick={onNext} 
                        disabled={!hasNext}
                        title="Next Pin"
                        aria-label="Next Pin"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                    <button 
                        className="mobile-sheet-icon-btn toggle-compact" 
                        onClick={() => setIsCompact(prev => !prev)}
                        title={isCompact ? "Expand" : "Minimize"}
                        aria-label={isCompact ? "Expand" : "Minimize"}
                    >
                        <i className={`fas ${isCompact ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                    </button>
                    <button 
                        className="mobile-sheet-icon-btn close-btn" 
                        onClick={onClose}
                        title="Close Inspector"
                        aria-label="Close Inspector"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>

            {/* Compact Mini Bar View: Shows minimal coords & quick nudge so map stays visible */}
            {isCompact ? (
                <div className="mobile-sheet-compact-bar">
                    <div className="compact-coords-preview">
                        <span className="compact-coord-tag">X: {location.coords.x}</span>
                        <span className="compact-coord-tag">Y: {location.coords.y}</span>
                    </div>

                    <div className="compact-quick-nudges">
                        <button className="compact-nudge-btn" onClick={() => onNudge(-nudgeStep, 0)} title="Left">
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button className="compact-nudge-btn" onClick={() => onNudge(0, -nudgeStep)} title="Up">
                            <i className="fas fa-chevron-up"></i>
                        </button>
                        <button className="compact-nudge-btn" onClick={() => onNudge(0, nudgeStep)} title="Down">
                            <i className="fas fa-chevron-down"></i>
                        </button>
                        <button className="compact-nudge-btn" onClick={() => onNudge(nudgeStep, 0)} title="Right">
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>

                    <button className="compact-center-btn" onClick={onFocusLocation} title="Center on Screen">
                        <i className="fas fa-bullseye"></i> Center
                    </button>
                </div>
            ) : (
                /* Full View: Segmented Tabs, Coords / Details, Touch D-Pad */
                <>
                    {/* Segmented Pill Tabs */}
                    <div className="mobile-sheet-tabs">
                        <button 
                            className={`mobile-sheet-tab ${activeTab === 'coords' ? 'active' : ''}`}
                            onClick={() => setActiveTab('coords')}
                        >
                            <i className="fas fa-crosshairs"></i> Position & Nudge
                        </button>
                        <button 
                            className={`mobile-sheet-tab ${activeTab === 'details' ? 'active' : ''}`}
                            onClick={() => setActiveTab('details')}
                        >
                            <i className="far fa-edit"></i> Location Info
                        </button>
                    </div>

                    {activeTab === 'coords' ? (
                        <div className="mobile-sheet-coords-view">
                            {/* Nudge Step Selector */}
                            <div className="mobile-sheet-step-row">
                                <span className="step-label">
                                    <i className="fas fa-arrows-alt"></i> Nudge Step:
                                </span>
                                <div className="mobile-sheet-step-pills">
                                    {[1, 10, 50].map((step) => (
                                        <button
                                            key={step}
                                            type="button"
                                            className={`mobile-step-pill ${nudgeStep === step ? 'active' : ''}`}
                                            onClick={() => onChangeNudgeStep(step)}
                                            aria-pressed={nudgeStep === step}
                                        >
                                            ±{step}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Stacked Coordinates Cards */}
                            <div className="mobile-sheet-coord-cards">
                                <div className="mobile-coord-card">
                                    <span className="coord-letter-badge x">X</span>
                                    <input 
                                        type="text" 
                                        inputMode="numeric"
                                        pattern="[0-9\-]*"
                                        className="mobile-coord-input"
                                        value={xText}
                                        onChange={(e) => handleXChange(e.target.value)}
                                        onBlur={handleXBlur}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                                        }}
                                        aria-label="X Coordinate"
                                    />
                                    <div className="mobile-steppers">
                                        <button 
                                            type="button"
                                            className="mobile-stepper-btn"
                                            onClick={() => onNudge(-nudgeStep, 0)}
                                            title={`Decrease X by ${nudgeStep}`}
                                            aria-label={`Decrease X by ${nudgeStep}`}
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <button 
                                            type="button"
                                            className="mobile-stepper-btn"
                                            onClick={() => onNudge(nudgeStep, 0)}
                                            title={`Increase X by ${nudgeStep}`}
                                            aria-label={`Increase X by ${nudgeStep}`}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="mobile-coord-card">
                                    <span className="coord-letter-badge y">Y</span>
                                    <input 
                                        type="text" 
                                        inputMode="numeric"
                                        pattern="[0-9\-]*"
                                        className="mobile-coord-input"
                                        value={yText}
                                        onChange={(e) => handleYChange(e.target.value)}
                                        onBlur={handleYBlur}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                                        }}
                                        aria-label="Y Coordinate"
                                    />
                                    <div className="mobile-steppers">
                                        <button 
                                            type="button"
                                            className="mobile-stepper-btn"
                                            onClick={() => onNudge(0, -nudgeStep)}
                                            title={`Decrease Y by ${nudgeStep}`}
                                            aria-label={`Decrease Y by ${nudgeStep}`}
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <button 
                                            type="button"
                                            className="mobile-stepper-btn"
                                            onClick={() => onNudge(0, nudgeStep)}
                                            title={`Increase Y by ${nudgeStep}`}
                                            aria-label={`Increase Y by ${nudgeStep}`}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile D-Pad Control */}
                            <div className="mobile-sheet-dpad-wrap">
                                <div className="mobile-dpad-grid">
                                    <button 
                                        className="mobile-dpad-btn up"
                                        onClick={() => onNudge(0, -nudgeStep)}
                                        title="Nudge Up"
                                        aria-label="Nudge Up"
                                    >
                                        <i className="fas fa-chevron-up"></i>
                                    </button>
                                    <div className="mobile-dpad-middle">
                                        <button 
                                            className="mobile-dpad-btn left"
                                            onClick={() => onNudge(-nudgeStep, 0)}
                                            title="Nudge Left"
                                            aria-label="Nudge Left"
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                        <button 
                                            className="mobile-dpad-btn center-focus"
                                            onClick={onFocusLocation}
                                            title="Center Pin on Screen"
                                            aria-label="Center Pin on Screen"
                                        >
                                            <i className="fas fa-bullseye"></i>
                                        </button>
                                        <button 
                                            className="mobile-dpad-btn right"
                                            onClick={() => onNudge(nudgeStep, 0)}
                                            title="Nudge Right"
                                            aria-label="Nudge Right"
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                    <button 
                                        className="mobile-dpad-btn down"
                                        onClick={() => onNudge(0, nudgeStep)}
                                        title="Nudge Down"
                                        aria-label="Nudge Down"
                                    >
                                        <i className="fas fa-chevron-down"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Details Tab */
                        <div className="mobile-sheet-details-view">
                            <div className="mobile-field-group">
                                <label className="mobile-field-label" htmlFor="m-edit-name">Location Name</label>
                                <input 
                                    id="m-edit-name"
                                    type="text"
                                    className="mobile-field-input"
                                    value={location.name}
                                    placeholder="e.g. Noida, Gandhinagar"
                                    onChange={(e) => onUpdateLocation({ name: e.target.value })}
                                />
                            </div>

                            <div className="mobile-field-group">
                                <label className="mobile-field-label" htmlFor="m-edit-state">State / Territory</label>
                                <input 
                                    id="m-edit-state"
                                    type="text"
                                    className="mobile-field-input"
                                    value={location.state}
                                    placeholder="e.g. Uttar Pradesh, Gujarat"
                                    onChange={(e) => onUpdateLocation({ state: e.target.value })}
                                />
                            </div>

                            <div className="mobile-field-group">
                                <label className="mobile-field-label" htmlFor="m-edit-desc">Syllabus Notes / Description</label>
                                <textarea 
                                    id="m-edit-desc"
                                    rows={2}
                                    className="mobile-field-textarea"
                                    value={location.description || ''}
                                    placeholder="Add syllabus notes or exam details..."
                                    onChange={(e) => onUpdateLocation({ description: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* Footer Actions: Center, Copy, Delete, Done */}
                    <div className="mobile-sheet-footer">
                        <button 
                            className="mobile-footer-btn yellow-primary"
                            onClick={onFocusLocation}
                            title="Center view on pin"
                        >
                            <i className="fas fa-crosshairs"></i> Center
                        </button>
                        <button 
                            className="mobile-footer-btn ghost"
                            onClick={onDuplicateLocation}
                            title="Duplicate pin"
                        >
                            <i className="far fa-copy"></i> Copy
                        </button>

                        {!showDeleteConfirm ? (
                            <button 
                                className="mobile-footer-btn danger"
                                onClick={() => setShowDeleteConfirm(true)}
                                title="Delete pin"
                            >
                                <i className="fas fa-trash-alt"></i> Delete
                            </button>
                        ) : (
                            <div className="mobile-inline-confirm">
                                <span>Delete pin?</span>
                                <button className="confirm-btn yes" onClick={onDeleteLocation}>Yes</button>
                                <button className="confirm-btn no" onClick={() => setShowDeleteConfirm(false)}>No</button>
                            </div>
                        )}

                        <button 
                            className="mobile-footer-btn done-btn"
                            onClick={onClose}
                            title="Done (Deselect pin)"
                        >
                            <i className="fas fa-check"></i> Done
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

/**
 * Redesigned Floating Popup Editing Menu (CalibInspectorCard).
 * Clean, compact, and elevated with yellow accents and a 2-tab switch (Position / Label Info).
 */
export const CalibInspectorCard: React.FC<{
    location: MapLocation;
    currentIndex: number;
    totalLocations: number;
    nudgeStep: number;
    onChangeNudgeStep: (step: number) => void;
    onUpdateLocation: (updated: Partial<MapLocation>) => void;
    onNudge: (dx: number, dy: number) => void;
    onFocusLocation: () => void;
    onDuplicateLocation: () => void;
    onDeleteLocation: () => void;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
}> = ({
    location,
    currentIndex,
    totalLocations,
    nudgeStep,
    onChangeNudgeStep,
    onUpdateLocation,
    onNudge,
    onFocusLocation,
    onDuplicateLocation,
    onDeleteLocation,
    onClose,
    onPrevious,
    onNext,
    hasPrevious,
    hasNext
}) => {
    const [activeTab, setActiveTab] = useState<'coords' | 'details'>('coords');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Controlled text states so users can easily edit/delete coordinate values without jumping
    const [xText, setXText] = useState(String(location.coords.x));
    const [yText, setYText] = useState(String(location.coords.y));

    useEffect(() => {
        setXText(String(location.coords.x));
        setYText(String(location.coords.y));
    }, [location.coords.x, location.coords.y]);

    useEffect(() => {
        setShowDeleteConfirm(false);
    }, [location]);

    const handleXChange = (valStr: string) => {
        setXText(valStr);
        const parsed = parseInt(valStr, 10);
        if (!isNaN(parsed)) {
            onUpdateLocation({ coords: { ...location.coords, x: parsed } });
        }
    };

    const handleXBlur = () => {
        const parsed = parseInt(xText, 10);
        if (isNaN(parsed)) {
            setXText(String(location.coords.x));
        }
    };

    const handleYChange = (valStr: string) => {
        setYText(valStr);
        const parsed = parseInt(valStr, 10);
        if (!isNaN(parsed)) {
            onUpdateLocation({ coords: { ...location.coords, y: parsed } });
        }
    };

    const handleYBlur = () => {
        const parsed = parseInt(yText, 10);
        if (isNaN(parsed)) {
            setYText(String(location.coords.y));
        }
    };

    return (
        <div className="calib-popup-menu" role="region" aria-label="Location Inspector">
            {/* Yellow Top Accent Line */}
            <div className="popup-yellow-accent-bar"></div>

            {/* Header: Title, Pin Badge & Nav */}
            <div className="popup-menu-header">
                <div className="popup-title-area">
                    <span className="popup-pin-badge">
                        <i className="fas fa-map-pin"></i> Pin #{currentIndex + 1}
                    </span>
                    <h3 className="popup-location-name" title={location.name}>
                        {location.name || 'Unnamed Location'}
                    </h3>
                </div>

                <div className="popup-header-controls">
                    <button 
                        className="popup-nav-arrow" 
                        onClick={onPrevious} 
                        disabled={!hasPrevious}
                        title="Previous Pin ([ key)"
                        aria-label="Previous Pin"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="popup-counter-badge">
                        {currentIndex + 1}/{totalLocations}
                    </span>
                    <button 
                        className="popup-nav-arrow" 
                        onClick={onNext} 
                        disabled={!hasNext}
                        title="Next Pin (] key)"
                        aria-label="Next Pin"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                    <button 
                        className="popup-close-btn" 
                        onClick={onClose}
                        title="Deselect Pin (Esc)"
                        aria-label="Close Inspector"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>

            {/* Segmented Switch: Position vs. Details */}
            <div className="popup-segmented-tabs">
                <button 
                    className={`segmented-tab ${activeTab === 'coords' ? 'active' : ''}`}
                    onClick={() => setActiveTab('coords')}
                >
                    <i className="fas fa-crosshairs"></i> Position
                </button>
                <button 
                    className={`segmented-tab ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('details')}
                >
                    <i className="far fa-edit"></i> Details
                </button>
            </div>

            {/* Body View: Coordinates & Nudge */}
            {activeTab === 'coords' ? (
                <div className="popup-coords-body">
                    {/* Step selector */}
                    <div className="popup-step-row">
                        <div className="step-caption">
                            <i className="fas fa-arrows-alt"></i>
                            <span>Nudge Step</span>
                        </div>
                        <div className="step-chip-group" role="group" aria-label="Nudge Step Size">
                            {[1, 10, 50].map((step) => (
                                <button
                                    key={step}
                                    type="button"
                                    className={`step-pill-btn ${nudgeStep === step ? 'active' : ''}`}
                                    onClick={() => onChangeNudgeStep(step)}
                                    title={`Nudge by ${step} units (Arrow keys)`}
                                    aria-pressed={nudgeStep === step}
                                >
                                    ±{step}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Coordinates Inputs Stack: Spacious, Never Overflowing */}
                    <div className="popup-coords-stack">
                        <div className="coord-chip-card">
                            <span className="coord-axis-tag x">X</span>
                            <input 
                                type="text" 
                                inputMode="numeric"
                                pattern="[0-9\-]*"
                                className="coord-text-field"
                                value={xText}
                                onChange={(e) => handleXChange(e.target.value)}
                                onBlur={handleXBlur}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                                }}
                                title="Edit X Coordinate (Click to type, press Enter when done)"
                                aria-label="X Coordinate"
                            />
                            <div className="coord-stepper-pair">
                                <button 
                                    type="button"
                                    className="coord-mini-btn"
                                    onClick={() => onNudge(-nudgeStep, 0)}
                                    title={`Decrease X by ${nudgeStep}`}
                                    aria-label={`Decrease X by ${nudgeStep}`}
                                >
                                    <i className="fas fa-minus"></i>
                                </button>
                                <button 
                                    type="button"
                                    className="coord-mini-btn"
                                    onClick={() => onNudge(nudgeStep, 0)}
                                    title={`Increase X by ${nudgeStep}`}
                                    aria-label={`Increase X by ${nudgeStep}`}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        <div className="coord-chip-card">
                            <span className="coord-axis-tag y">Y</span>
                            <input 
                                type="text" 
                                inputMode="numeric"
                                pattern="[0-9\-]*"
                                className="coord-text-field"
                                value={yText}
                                onChange={(e) => handleYChange(e.target.value)}
                                onBlur={handleYBlur}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                                }}
                                title="Edit Y Coordinate (Click to type, press Enter when done)"
                                aria-label="Y Coordinate"
                            />
                            <div className="coord-stepper-pair">
                                <button 
                                    type="button"
                                    className="coord-mini-btn"
                                    onClick={() => onNudge(0, -nudgeStep)}
                                    title={`Decrease Y by ${nudgeStep}`}
                                    aria-label={`Decrease Y by ${nudgeStep}`}
                                >
                                    <i className="fas fa-minus"></i>
                                </button>
                                <button 
                                    type="button"
                                    className="coord-mini-btn"
                                    onClick={() => onNudge(0, nudgeStep)}
                                    title={`Increase Y by ${nudgeStep}`}
                                    aria-label={`Increase Y by ${nudgeStep}`}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Touch D-Pad */}
                    <div className="popup-dpad-container">
                        <div className="dpad-cross">
                            <button 
                                className="dpad-cell up"
                                onClick={() => onNudge(0, -nudgeStep)}
                                title="Nudge Up (Arrow Up)"
                                aria-label="Nudge Up"
                            >
                                <i className="fas fa-chevron-up"></i>
                            </button>
                            <div className="dpad-mid-row">
                                <button 
                                    className="dpad-cell left"
                                    onClick={() => onNudge(-nudgeStep, 0)}
                                    title="Nudge Left (Arrow Left)"
                                    aria-label="Nudge Left"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button 
                                    className="dpad-cell center-bullseye"
                                    onClick={onFocusLocation}
                                    title="Center Pin on Screen (Space)"
                                    aria-label="Center on Screen"
                                >
                                    <i className="fas fa-bullseye"></i>
                                </button>
                                <button 
                                    className="dpad-cell right"
                                    onClick={() => onNudge(nudgeStep, 0)}
                                    title="Nudge Right (Arrow Right)"
                                    aria-label="Nudge Right"
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                            <button 
                                className="dpad-cell down"
                                onClick={() => onNudge(0, nudgeStep)}
                                title="Nudge Down (Arrow Down)"
                                aria-label="Nudge Down"
                            >
                                <i className="fas fa-chevron-down"></i>
                            </button>
                        </div>
                        <span className="popup-kbd-guide">
                            <i className="far fa-keyboard"></i> Arrow keys to nudge (Alt=1, Shift=50)
                        </span>
                    </div>
                </div>
            ) : (
                /* Body View: Details (Name, State, Notes) */
                <div className="popup-details-body">
                    <div className="popup-form-field">
                        <label className="field-caption" htmlFor="edit-name">Location Name</label>
                        <input 
                            id="edit-name"
                            type="text"
                            className="field-text-box"
                            value={location.name}
                            placeholder="e.g. Noida, Tehri Dam"
                            onChange={(e) => onUpdateLocation({ name: e.target.value })}
                        />
                    </div>

                    <div className="popup-form-field">
                        <label className="field-caption" htmlFor="edit-state">State / Region</label>
                        <input 
                            id="edit-state"
                            type="text"
                            className="field-text-box"
                            value={location.state}
                            placeholder="e.g. Uttar Pradesh"
                            onChange={(e) => onUpdateLocation({ state: e.target.value })}
                        />
                    </div>

                    <div className="popup-form-field">
                        <label className="field-caption" htmlFor="edit-desc">Description / Notes</label>
                        <textarea 
                            id="edit-desc"
                            rows={3}
                            className="field-text-area"
                            value={location.description || ''}
                            placeholder="Syllabus facts or key exam details..."
                            onChange={(e) => onUpdateLocation({ description: e.target.value })}
                        />
                    </div>
                </div>
            )}

            {/* Footer Actions: Center, Duplicate, Delete */}
            <div className="popup-menu-footer">
                <button 
                    className="popup-action-btn primary-yellow"
                    onClick={onFocusLocation}
                    title="Center view on pin (Space)"
                >
                    <i className="fas fa-crosshairs"></i> Center
                </button>
                <button 
                    className="popup-action-btn ghost"
                    onClick={onDuplicateLocation}
                    title="Duplicate pin (Ctrl+D)"
                >
                    <i className="far fa-copy"></i> Copy
                </button>

                {!showDeleteConfirm ? (
                    <button 
                        className="popup-action-btn danger-ghost"
                        onClick={() => setShowDeleteConfirm(true)}
                        title="Delete pin (Del)"
                    >
                        <i className="fas fa-trash-alt"></i> Delete
                    </button>
                ) : (
                    <div className="inline-delete-confirm">
                        <span>Delete?</span>
                        <button className="confirm-btn-yes" onClick={onDeleteLocation}>Yes</button>
                        <button className="confirm-btn-no" onClick={() => setShowDeleteConfirm(false)}>No</button>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Mobile-Optimized Calibration UI Suite (MobileCalibSuite).
 * Designed specifically for mobile screens (< 768px).
 * Fully consistent with Naksha's app design language (frosted glass, teal primary, yellow accent highlights, rounded pills, floating cards).
 */
export const MobileCalibSuite: React.FC<{
    categories: MapCategory[];
    activeCategoryIndex: number;
    onSelectCategoryIndex: (index: number) => void;
    isAddingPin: boolean;
    onToggleAddPin: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onOpenExport: () => void;
    onResetData: () => void;
    onExit: () => void;
    selectedLocation: MapLocation | null;
    currentIndex: number;
    totalLocations: number;
    nudgeStep: number;
    onChangeNudgeStep: (step: number) => void;
    onUpdateLocation: (updated: Partial<MapLocation>) => void;
    onNudge: (dx: number, dy: number) => void;
    onFocusLocation: () => void;
    onDuplicateLocation: () => void;
    onDeleteLocation: () => void;
    onCloseInspector: () => void;
    onPreviousLocation: () => void;
    onNextLocation: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
    coords: { x: number; y: number } | null;
    zoomLevel: number;
    locations: MapLocation[];
    onSelectLocationIndex: (index: number) => void;
}> = ({
    categories,
    activeCategoryIndex,
    onSelectCategoryIndex,
    isAddingPin,
    onToggleAddPin,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onOpenExport,
    onExit,
    selectedLocation,
    currentIndex,
    totalLocations,
    nudgeStep,
    onChangeNudgeStep,
    onUpdateLocation,
    onNudge,
    onFocusLocation,
    onDuplicateLocation,
    onDeleteLocation,
    onCloseInspector,
    onPreviousLocation,
    onNextLocation,
    hasPrevious,
    hasNext,
    coords,
    zoomLevel,
    locations,
    onSelectLocationIndex
}) => {
    const [activeTab, setActiveTab] = useState<'coords' | 'details'>('coords');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [xText, setXText] = useState(selectedLocation ? String(selectedLocation.coords.x) : '0');
    const [yText, setYText] = useState(selectedLocation ? String(selectedLocation.coords.y) : '0');

    useEffect(() => {
        if (selectedLocation) {
            setXText(String(selectedLocation.coords.x));
            setYText(String(selectedLocation.coords.y));
            setShowDeleteConfirm(false);
        }
    }, [selectedLocation?.coords.x, selectedLocation?.coords.y, selectedLocation]);

    const handleXChange = (valStr: string) => {
        setXText(valStr);
        const parsed = parseInt(valStr, 10);
        if (!isNaN(parsed) && selectedLocation) {
            onUpdateLocation({ coords: { ...selectedLocation.coords, x: parsed } });
        }
    };

    const handleXBlur = () => {
        if (selectedLocation) {
            const parsed = parseInt(xText, 10);
            if (isNaN(parsed)) {
                setXText(String(selectedLocation.coords.x));
            }
        }
    };

    const handleYChange = (valStr: string) => {
        setYText(valStr);
        const parsed = parseInt(valStr, 10);
        if (!isNaN(parsed) && selectedLocation) {
            onUpdateLocation({ coords: { ...selectedLocation.coords, y: parsed } });
        }
    };

    const handleYBlur = () => {
        if (selectedLocation) {
            const parsed = parseInt(yText, 10);
            if (isNaN(parsed)) {
                setYText(String(selectedLocation.coords.y));
            }
        }
    };

    return (
        <div className="mobile-calib-container" role="region" aria-label="Mobile Calibration Mode">
            {/* Top Minimal HUD Bar (Styled like Quiz HUD Top Pill) */}
            <div className="mobile-calib-top-bar">
                <button 
                    className="mobile-top-btn exit" 
                    onClick={onExit}
                    title="Exit Calibration Mode"
                    aria-label="Exit Calibration Mode"
                >
                    <i className="fas fa-arrow-left"></i>
                    <span>Exit</span>
                </button>

                <div className="mobile-top-divider"></div>

                <div className="mobile-top-cat-wrap">
                    <i className="fas fa-crosshairs mobile-top-cat-icon"></i>
                    <select 
                        className="mobile-top-cat-select"
                        value={activeCategoryIndex}
                        onChange={(e) => onSelectCategoryIndex(parseInt(e.target.value, 10))}
                        aria-label="Select Category"
                    >
                        {categories.map((cat, idx) => (
                            <option key={idx} value={idx}>{cat.title}</option>
                        ))}
                    </select>
                </div>

                <div className="mobile-top-divider"></div>

                <div className="mobile-top-actions">
                    <button 
                        className={`mobile-top-action-btn ${canUndo ? '' : 'disabled'}`}
                        onClick={onUndo}
                        disabled={!canUndo}
                        title="Undo"
                        aria-label="Undo"
                    >
                        <i className="fas fa-undo"></i>
                    </button>
                    <button 
                        className={`mobile-top-action-btn ${canRedo ? '' : 'disabled'}`}
                        onClick={onRedo}
                        disabled={!canRedo}
                        title="Redo"
                        aria-label="Redo"
                    >
                        <i className="fas fa-redo"></i>
                    </button>
                    <button 
                        className="mobile-top-action-btn"
                        onClick={onOpenExport}
                        title="Export/Import"
                        aria-label="Export or Import"
                    >
                        <i className="fas fa-file-export"></i>
                    </button>
                </div>
            </div>

            {/* Pulsing Yellow Add Pin Alert Pill */}
            {isAddingPin && (
                <div className="mobile-add-pin-alert-pill" role="status">
                    <div className="alert-text-group">
                        <i className="fas fa-map-pin"></i>
                        <span>Tap anywhere on map to drop pin</span>
                    </div>
                    <button className="alert-cancel-pill" onClick={onToggleAddPin}>
                        Cancel
                    </button>
                </div>
            )}

            {/* Bottom Floating Sheet / Card (Styled like Quiz Target Card) */}
            <div className={`mobile-calib-bottom-card ${selectedLocation ? 'has-active-inspector' : 'idle-mode'}`}>
                {/* Drag / Accent Bar */}
                <div className="mobile-card-accent-bar"></div>

                {!selectedLocation ? (
                    /* Idle Calibration Dock View */
                    <div className="mobile-idle-hud-view">
                        <div className="mobile-idle-top-row">
                            <span className="mobile-status-tag">
                                <i className="fas fa-crosshairs"></i> CALIBRATION
                            </span>
                            <span className="mobile-coords-tag">
                                {coords ? `X: ${coords.x} Y: ${coords.y}` : 'X: — Y: —'} &bull; {zoomLevel.toFixed(1)}x
                            </span>
                        </div>

                        <div className="mobile-idle-actions-row">
                            <button 
                                className={`mobile-add-pin-hero-btn ${isAddingPin ? 'active' : ''}`}
                                onClick={onToggleAddPin}
                            >
                                <i className={`fas ${isAddingPin ? 'fa-times' : 'fa-plus'}`}></i>
                                <span>{isAddingPin ? 'Cancel' : 'Add Pin'}</span>
                            </button>

                            <select 
                                className="mobile-pin-picker-select"
                                value={-1}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (val >= 0) onSelectLocationIndex(val);
                                }}
                                aria-label="Select pin to inspect"
                            >
                                <option value={-1}>Pins ({locations.length}) &hellip;</option>
                                {locations.map((loc, idx) => (
                                    <option key={idx} value={idx}>#{idx + 1}: {loc.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ) : (
                    /* Selected Pin Inspector View */
                    <div className="mobile-inspector-view">
                        {/* Header: Title & Pin Nav */}
                        <div className="mobile-inspector-header">
                            <div className="mobile-inspector-title-wrap">
                                <span className="mobile-pin-number-badge">Pin #{currentIndex + 1}</span>
                                <h3 className="mobile-inspector-title">{selectedLocation.name || 'Unnamed Location'}</h3>
                            </div>

                            <div className="mobile-inspector-nav-group">
                                <button 
                                    className="mobile-nav-btn" 
                                    onClick={onPreviousLocation} 
                                    disabled={!hasPrevious}
                                    aria-label="Previous Pin"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <span className="mobile-counter-text">{currentIndex + 1}/{totalLocations}</span>
                                <button 
                                    className="mobile-nav-btn" 
                                    onClick={onNextLocation} 
                                    disabled={!hasNext}
                                    aria-label="Next Pin"
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                                <button 
                                    className="mobile-close-btn" 
                                    onClick={onCloseInspector}
                                    aria-label="Close Inspector"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>

                        {/* Segmented Tab Switch */}
                        <div className="mobile-segmented-tabs">
                            <button 
                                className={`mobile-tab-btn ${activeTab === 'coords' ? 'active' : ''}`}
                                onClick={() => setActiveTab('coords')}
                            >
                                <i className="fas fa-crosshairs"></i> Position
                            </button>
                            <button 
                                className={`mobile-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                                onClick={() => setActiveTab('details')}
                            >
                                <i className="far fa-edit"></i> Details
                            </button>
                        </div>

                        {activeTab === 'coords' ? (
                            <div className="mobile-coords-content">
                                {/* Step selector row */}
                                <div className="mobile-step-row">
                                    <span className="mobile-step-label"><i className="fas fa-arrows-alt"></i> Step</span>
                                    <div className="mobile-step-pill-group">
                                        {[1, 10, 50].map((step) => (
                                            <button 
                                                key={step}
                                                type="button"
                                                className={`mobile-step-chip ${nudgeStep === step ? 'active' : ''}`}
                                                onClick={() => onChangeNudgeStep(step)}
                                            >
                                                ±{step}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Coords input rows */}
                                <div className="mobile-coords-fields-stack">
                                    <div className="mobile-coord-field-card">
                                        <span className="mobile-axis-badge x">X</span>
                                        <input 
                                            type="text" 
                                            inputMode="numeric"
                                            pattern="[0-9\-]*"
                                            className="mobile-coord-input"
                                            value={xText}
                                            onChange={(e) => handleXChange(e.target.value)}
                                            onBlur={handleXBlur}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                                            }}
                                            aria-label="X Coordinate"
                                        />
                                        <div className="mobile-stepper-btns">
                                            <button 
                                                type="button" 
                                                className="mobile-step-btn" 
                                                onClick={() => onNudge(-nudgeStep, 0)}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <button 
                                                type="button" 
                                                className="mobile-step-btn" 
                                                onClick={() => onNudge(nudgeStep, 0)}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mobile-coord-field-card">
                                        <span className="mobile-axis-badge y">Y</span>
                                        <input 
                                            type="text" 
                                            inputMode="numeric"
                                            pattern="[0-9\-]*"
                                            className="mobile-coord-input"
                                            value={yText}
                                            onChange={(e) => handleYChange(e.target.value)}
                                            onBlur={handleYBlur}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                                            }}
                                            aria-label="Y Coordinate"
                                        />
                                        <div className="mobile-stepper-btns">
                                            <button 
                                                type="button" 
                                                className="mobile-step-btn" 
                                                onClick={() => onNudge(0, -nudgeStep)}
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <button 
                                                type="button" 
                                                className="mobile-step-btn" 
                                                onClick={() => onNudge(0, nudgeStep)}
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Touch D-Pad */}
                                <div className="mobile-dpad-wrapper">
                                    <div className="mobile-dpad-cross">
                                        <button 
                                            className="mobile-dpad-btn up"
                                            onClick={() => onNudge(0, -nudgeStep)}
                                            aria-label="Nudge Up"
                                        >
                                            <i className="fas fa-chevron-up"></i>
                                        </button>
                                        <div className="mobile-dpad-mid-row">
                                            <button 
                                                className="mobile-dpad-btn left"
                                                onClick={() => onNudge(-nudgeStep, 0)}
                                                aria-label="Nudge Left"
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                            <button 
                                                className="mobile-dpad-btn bullseye"
                                                onClick={onFocusLocation}
                                                title="Center Pin on Screen"
                                                aria-label="Center on Screen"
                                            >
                                                <i className="fas fa-bullseye"></i>
                                            </button>
                                            <button 
                                                className="mobile-dpad-btn right"
                                                onClick={() => onNudge(nudgeStep, 0)}
                                                aria-label="Nudge Right"
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </div>
                                        <button 
                                            className="mobile-dpad-btn down"
                                            onClick={() => onNudge(0, nudgeStep)}
                                            aria-label="Nudge Down"
                                        >
                                            <i className="fas fa-chevron-down"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mobile-details-content">
                                <div className="mobile-form-group">
                                    <label className="mobile-form-label">Location Name</label>
                                    <input 
                                        type="text"
                                        className="mobile-form-input"
                                        value={selectedLocation.name}
                                        placeholder="e.g. Noida, Tehri Dam"
                                        onChange={(e) => onUpdateLocation({ name: e.target.value })}
                                    />
                                </div>

                                <div className="mobile-form-group">
                                    <label className="mobile-form-label">State / Region</label>
                                    <input 
                                        type="text"
                                        className="mobile-form-input"
                                        value={selectedLocation.state}
                                        placeholder="e.g. Uttar Pradesh"
                                        onChange={(e) => onUpdateLocation({ state: e.target.value })}
                                    />
                                </div>

                                <div className="mobile-form-group">
                                    <label className="mobile-form-label">Description / Syllabus Notes</label>
                                    <textarea 
                                        rows={2}
                                        className="mobile-form-textarea"
                                        value={selectedLocation.description || ''}
                                        placeholder="Key facts for quiz..."
                                        onChange={(e) => onUpdateLocation({ description: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Footer Action Buttons */}
                        <div className="mobile-inspector-footer">
                            <button 
                                className="mobile-footer-btn yellow-primary"
                                onClick={onFocusLocation}
                            >
                                <i className="fas fa-crosshairs"></i> Center
                            </button>

                            <button 
                                className="mobile-footer-btn ghost"
                                onClick={onDuplicateLocation}
                            >
                                <i className="far fa-copy"></i> Copy
                            </button>

                            {!showDeleteConfirm ? (
                                <button 
                                    className="mobile-footer-btn danger"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    <i className="fas fa-trash-alt"></i> Delete
                                </button>
                            ) : (
                                <div className="mobile-delete-confirm-box">
                                    <span>Delete?</span>
                                    <button className="confirm-yes" onClick={onDeleteLocation}>Yes</button>
                                    <button className="confirm-no" onClick={() => setShowDeleteConfirm(false)}>No</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Clean Dataset Export / Import Modal.
 * Yellow accent styling.
 */
export const StudioExportImportModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    mapData: MapCategory[];
    onImportData: (importedData: MapCategory[]) => void;
}> = ({ isOpen, onClose, mapData, onImportData }) => {
    const [tab, setTab] = useState<'ts' | 'json' | 'import'>('ts');
    const [copied, setCopied] = useState(false);
    const [importText, setImportText] = useState('');
    const [importError, setImportError] = useState<string | null>(null);
    const [importSuccess, setImportSuccess] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const code = useMemo(() => {
        if (tab === 'json') {
            return JSON.stringify(mapData, null, 2);
        }
        const jsonStr = JSON.stringify(mapData, null, 2)
            .replace(/"coords": {\s+"x": (-?\d+),\s+"y": (-?\d+)\s+}/g, '"coords": { "x": $1, "y": $2 }');
        return `import { MapCategory } from '../types';\n\nexport const mapData: MapCategory[] = ${jsonStr};\n`;
    }, [mapData, tab]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const filename = tab === 'ts' ? 'data.ts' : 'mapData.json';
        const blob = new Blob([code], { type: tab === 'ts' ? 'text/typescript' : 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleApplyImport = () => {
        setImportError(null);
        setImportSuccess(false);

        try {
            let parsed: any;
            const cleaned = importText.trim();
            if (!cleaned) {
                setImportError('Please paste JSON or TypeScript data into the box.');
                return;
            }

            if (cleaned.startsWith('export const') || cleaned.includes('mapData')) {
                const jsonMatch = cleaned.match(/=\s*(\[[\s\S]*\]);?/);
                if (jsonMatch && jsonMatch[1]) {
                    parsed = JSON.parse(jsonMatch[1]);
                } else {
                    throw new Error('Could not parse mapData array from TypeScript string');
                }
            } else {
                parsed = JSON.parse(cleaned);
            }

            if (!Array.isArray(parsed) || parsed.length === 0) {
                throw new Error('Data must be an array of category objects with locations.');
            }

            const isValid = parsed.every(cat => cat.title && Array.isArray(cat.locations));
            if (!isValid) {
                throw new Error('Each item must contain a "title" string and "locations" array.');
            }

            onImportData(parsed);
            setImportSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err: any) {
            setImportError(err.message || 'Invalid format. Check syntax and try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="export-dialog-title">
            <div className="modal-card calib-yellow-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3 id="export-dialog-title">Map Dataset Studio</h3>
                        <p className="modal-subtext">Export or import label coordinates and syllabus metadata</p>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-tab-pills">
                        <button 
                            className={`modal-tab-pill ${tab === 'ts' ? 'active' : ''}`}
                            onClick={() => setTab('ts')}
                        >
                            TypeScript (data.ts)
                        </button>
                        <button 
                            className={`modal-tab-pill ${tab === 'json' ? 'active' : ''}`}
                            onClick={() => setTab('json')}
                        >
                            JSON
                        </button>
                        <button 
                            className={`modal-tab-pill ${tab === 'import' ? 'active' : ''}`}
                            onClick={() => setTab('import')}
                        >
                            <i className="fas fa-file-import"></i> Import Dataset
                        </button>
                    </div>

                    {tab !== 'import' ? (
                        <textarea 
                            readOnly 
                            value={code} 
                            className="modal-code-area" 
                            spellCheck={false}
                        />
                    ) : (
                        <div className="modal-import-wrap">
                            <p className="modal-hint">
                                Paste JSON or TypeScript <code>mapData</code> array below to update the map:
                            </p>
                            <textarea 
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                                className="modal-code-area"
                                placeholder={`[\n  {\n    "title": "Rivers",\n    "icon": "fa-water",\n    "locations": [\n      { "name": "Ganga", "state": "Uttarakhand", "coords": { "x": 8000, "y": 9000 }, "description": "..." }\n    ]\n  }\n]`}
                                spellCheck={false}
                            />
                            {importError && (
                                <div className="modal-status-badge error">
                                    <i className="fas fa-exclamation-triangle"></i> {importError}
                                </div>
                            )}
                            {importSuccess && (
                                <div className="modal-status-badge success">
                                    <i className="fas fa-check-circle"></i> Successfully imported and updated map!
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {tab !== 'import' ? (
                        <>
                            <button className="footer-btn ghost" onClick={handleCopy}>
                                {copied ? <><i className="fas fa-check"></i> Copied to Clipboard</> : <><i className="far fa-copy"></i> Copy Code</>}
                            </button>
                            <button className="footer-btn yellow" onClick={handleDownload}>
                                <i className="fas fa-download"></i> Download File
                            </button>
                        </>
                    ) : (
                        <button className="footer-btn yellow" onClick={handleApplyImport}>
                            <i className="fas fa-check"></i> Apply to Map
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
