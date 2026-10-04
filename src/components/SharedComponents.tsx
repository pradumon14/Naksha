import React, { useState, useEffect } from 'react';
import { MapCategory, DownloadItem, MapLocation } from '../types';

/**
 * Renders the Downloads page with a list of PDF resources.
 */
export const DownloadsPage: React.FC<{ downloadsData: DownloadItem[] }> = ({ downloadsData }) => {
    return (
        <div className="page-wrapper new-design-bg">
            <div className="page-content animate-slide-up downloads-content">
                <div className="about-hero">
                    <div className="about-hero-badge"><i className="fas fa-layer-group"></i> Resources</div>
                    <h1 className="about-hero-title">Practice Library</h1>
                    <p className="about-hero-subtitle">Premium, high-resolution geographic resources to elevate your practice and conquer every exam.</p>
                </div>

                <div className="downloads-grid-aesthetic">
                    {downloadsData.map((item, index) => {
                        const isAvailable = item.downloadUrl && item.downloadUrl !== '#';
                        return (
                            <div key={index} className="download-card-premium glass-card">
                                <div className="dl-premium-preview">
                                    <div className="dl-premium-pattern"></div>
                                    <div className="dl-premium-icon">
                                        <i className={`fas ${item.icon || 'fa-map'}`}></i>
                                    </div>
                                    <div className="dl-premium-badge-group">
                                        <span className="dl-badge-pdf"><i className="fas fa-file-pdf"></i> PDF</span>
                                        <span className="dl-badge-size">{item.size}</span>
                                    </div>
                                </div>
                                <div className="dl-premium-content">
                                    <h3 className="dl-premium-title">{item.title}</h3>
                                    <p className="dl-premium-desc">{item.description}</p>
                                </div>
                                <div className="dl-premium-footer">
                                    {isAvailable ? (
                                        <a 
                                            href={item.downloadUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="dl-premium-btn"
                                            aria-label={`Download ${item.title} PDF`}
                                        >
                                            <span>Download Resource</span>
                                        </a>
                                    ) : (
                                        <button 
                                            className="dl-premium-btn" 
                                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                            disabled
                                            title="Resource coming in the next syllabus update"
                                        >
                                            <span>Coming Soon</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

/**
 * Modal for selecting a geographic category (e.g., Dams, Airports).
 */
export const CategoryModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    categories: MapCategory[];
    activeTitle: string;
    onSelect: (title: string) => void;
}> = ({ isOpen, onClose, categories, activeTitle, onSelect }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="modal-backdrop-new" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
        >
            <div className="modal-card-aesthetic topic-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-aesthetic-header">
                    <div className="modal-aesthetic-shape shape-1"></div>
                    <div className="modal-aesthetic-shape shape-2"></div>
                    <div className="header-icon-wrapper-aesthetic">
                        <i className="fas fa-layer-group"></i>
                    </div>
                    <h3 className="modal-aesthetic-title" id="category-modal-title">Select Topic</h3>
                    <p className="modal-aesthetic-subtitle">Choose a map category to practice or take a quiz.</p>
                    <button 
                        className="close-btn-aesthetic" 
                        onClick={onClose} 
                        aria-label="Close topic selection"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="cat-grid-aesthetic" role="listbox">
                    {categories.map((cat, idx) => (
                        <button 
                            key={idx} 
                            className={`cat-card-aesthetic glass-card ${activeTitle === cat.title ? 'active' : ''}`}
                            onClick={() => { onSelect(cat.title); onClose(); }}
                            role="option"
                            aria-selected={activeTitle === cat.title}
                        >
                            <div className="cat-aesthetic-preview">
                                <div className="cat-aesthetic-pattern"></div>
                                <div className="cat-aesthetic-icon">
                                    <i className={`fas ${cat.icon}`}></i>
                                </div>
                            </div>
                            <div className="cat-aesthetic-info">
                                <h4>{cat.title}</h4>
                                <span>{cat.locations.length} Locations</span>
                            </div>
                            {activeTitle === cat.title && (
                                <div className="cat-aesthetic-active-badge">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * Modal used in Calibration Mode to export updated coordinate data.
 */
export const CalibrationExportModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    data: MapCategory[];
}> = ({ isOpen, onClose, data }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const dataString = `const mapData = ${JSON.stringify(data, null, 2)
        .replace(/"coords": {\s+"x": (-?\d+),\s+"y": (-?\d+)\s+}/g, '"coords": { "x": $1, "y": $2 }')};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(dataString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div 
            className="modal-backdrop" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
        >
            <div className="modal-card" style={{ maxWidth: '800px', height: '80vh' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 id="export-modal-title">Export Calibrated Data</h3>
                    <button onClick={onClose} aria-label="Close export dialog"><i className="fas fa-times"></i></button>
                </div>
                <div className="export-modal-content">
                    <p>Copy this code and replace the entire `mapData` variable in <strong>data.ts</strong>.</p>
                    <textarea 
                        readOnly 
                        value={dataString}
                        className="export-modal-textarea"
                    />
                </div>
                <div className="export-modal-footer">
                     <button className="dl-action-btn" style={{ width: 'auto' }} onClick={handleCopy}>
                        {copied ? <><i className="fas fa-check"></i> Copied!</> : <><i className="far fa-copy"></i> Copy Code</>}
                     </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Displays the results of a quiz session, including score and mistakes.
 */
export const QuizSummary: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    score: number;
    total: number;
    mistakes: MapLocation[];
    onRetry: () => void;
    onNextTopic: () => void;
}> = ({ isOpen, onClose, score, total, mistakes, onRetry, onNextTopic }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    const isPerfect = mistakes.length === 0 && total > 0;
    const correctAnswers = Math.max(0, total - mistakes.length);

    return (
        <div 
            className="modal-backdrop-new"
            role="dialog"
            aria-modal="true"
            aria-labelledby="summary-result-title"
        >
            <div className="summary-aesthetic-card glass-card">
                <div className={`summary-aesthetic-header ${isPerfect ? 'perfect' : ''}`}>
                    <div className="modal-aesthetic-shape shape-1"></div>
                    <div className="modal-aesthetic-shape shape-2"></div>
                    
                    <div className="summary-aesthetic-title-wrap">
                        <h2 id="summary-result-title">{isPerfect ? 'Flawless Execution!' : 'Quiz Result'}</h2>
                        <div className="quiz-fraction-score">
                            <span className="quiz-fraction-correct">{correctAnswers}</span>
                            <span className="quiz-fraction-separator">/</span>
                            <span className="quiz-fraction-total">{total}</span>
                        </div>
                        <p style={{ marginTop: '0.25rem', fontSize: '0.9rem', opacity: 0.9 }}>
                            targets located securely.
                        </p>
                        <div style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600 }}>
                            <i className="fas fa-star" style={{ color: '#f59e0b' }}></i> {score} Total Points
                        </div>
                    </div>
                </div>

                {mistakes.length > 0 ? (
                    <div className="summary-mistakes-section">
                        <div className="summary-mistakes-header">
                            <h4><i className="fas fa-exclamation-circle text-warning"></i> Needs Review</h4>
                            <span className="summary-mistakes-count">{mistakes.length} Locations</span>
                        </div>
                        <div className="summary-mistake-grid">
                            {mistakes.map((m, idx) => (
                                <div key={idx} className="summary-mistake-item">
                                    <div className="mistake-icon"><i className="fas fa-map-marker-alt"></i></div>
                                    <span>{m.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="summary-perfect-section">
                        <div className="summary-perfect-icon">
                            <i className="fas fa-crown"></i>
                        </div>
                        <h3>Operation Perfect</h3>
                        <p>Impeccable geographic knowledge.</p>
                    </div>
                )}

                <div className="summary-aesthetic-actions">
                    <button className="summary-btn-outline" onClick={onClose} title="Return to Map" aria-label="Return to Map">
                        <i className="fas fa-map"></i>
                    </button>
                    <button className="summary-btn-secondary" onClick={onRetry} title="Retry Quiz" aria-label="Retry Quiz">
                        <i className="fas fa-redo"></i>
                    </button>
                    <button className="summary-btn-primary" onClick={onNextTopic} title="Next Topic" aria-label="Next Topic">
                        <i className="fas fa-forward"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Detailed info card for a specific location, shown on double-click or info button click.
 */
export const LocationInfoModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    data: (MapLocation & { icon?: string }) | null;
}> = ({ isOpen, onClose, data }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !data) return null;

    return (
        <div 
            className="location-info-overlay" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-modal-title"
        >
            <div className="location-info-card animate-slide-up" onClick={e => e.stopPropagation()}>
                <button className="location-info-close" onClick={onClose} aria-label="Close location details">
                    <i className="fas fa-times"></i>
                </button>
                <div className="location-info-header">
                    <div className="location-info-icon">
                        <i className={`fas ${data.icon || 'fa-map-pin'}`}></i>
                    </div>
                    <div className="location-info-title-group">
                        <h3 className="location-info-title" id="location-modal-title">{data.name}</h3>
                        <p className="location-info-subtitle">
                            <i className="fas fa-map-pin"></i> {data.state}
                        </p>
                    </div>
                </div>
                <div className="location-info-body">
                    <p>{data.description}</p>
                </div>
            </div>
        </div>
    );
};

/**
 * Full-screen overlay for the quiz start countdown.
 */
export const CountdownOverlay: React.FC<{ count: number | null }> = ({ count }) => {
    if (count === null) return null;
    return (
        <div className="countdown-overlay" aria-live="assertive" role="alert">
            <div className="countdown-number" key={count}>
                {count === 0 ? 'GO!' : count}
            </div>
        </div>
    );
};
