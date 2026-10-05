import React from 'react';

interface MapControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    onShare: () => void;
    isCalibrating?: boolean;
    onToggleCalibrate?: () => void;
}

/**
 * Floating map controls for zoom, reset, sharing, and dev tools with accessibility.
 */
export const MapControls: React.FC<MapControlsProps> = ({ 
    onZoomIn, 
    onZoomOut, 
    onReset, 
    onShare,
    isCalibrating,
    onToggleCalibrate 
}) => {
    return (
        <div className="map-zoom-controls" role="toolbar" aria-label="Map Navigation Controls">
            <button onClick={onZoomIn} title="Zoom In" aria-label="Zoom in on map">
                <i className="fas fa-plus"></i>
            </button>
            <button onClick={onZoomOut} title="Zoom Out" aria-label="Zoom out on map">
                <i className="fas fa-minus"></i>
            </button>
            <button onClick={onReset} title="Reset View" aria-label="Reset map view to default">
                <i className="fas fa-compress-arrows-alt"></i>
            </button>
            <button onClick={onShare} title="Share Naksha" aria-label="Share Naksha platform">
                <i className="fas fa-share-alt"></i>
            </button>
            {onToggleCalibrate && (
                <button 
                    onClick={onToggleCalibrate} 
                    className={`dev-toggle-map-btn ${isCalibrating ? 'active' : ''}`}
                    title={isCalibrating ? "Close Dev Tools (Alt+C)" : "Open Dev Tools & Calibration (Alt+C)"} 
                    aria-label="Toggle Calibration & Dev Tools"
                >
                    <i className="fas fa-crosshairs"></i>
                </button>
            )}
        </div>
    );
};
