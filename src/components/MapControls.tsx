import React from 'react';

interface MapControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    onShare: () => void;
}

/**
 * Floating map controls for zoom, reset, and sharing.
 */
export const MapControls: React.FC<MapControlsProps> = ({ onZoomIn, onZoomOut, onReset, onShare }) => {
    return (
        <div className="map-zoom-controls">
            <button onClick={onZoomIn} title="Zoom In"><i className="fas fa-plus"></i></button>
            <button onClick={onZoomOut} title="Zoom Out"><i className="fas fa-minus"></i></button>
            <button onClick={onReset} title="Reset View"><i className="fas fa-compress-arrows-alt"></i></button>
            <button onClick={onShare} title="Share Naksha"><i className="fas fa-share-alt"></i></button>
        </div>
    );
};
