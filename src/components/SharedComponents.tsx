import React, { useState } from 'react';
import { MapCategory, DownloadItem, Badge, MapLocation } from '../types';

/**
 * Renders the Downloads page with a list of PDF resources.
 */
export const DownloadsPage = ({ downloadsData }: { downloadsData: DownloadItem[] }) => {
    return (
        <div className="page-wrapper new-design-bg">
            <div className="page-content animate-slide-up downloads-content">
                <div className="about-hero">
                    <div className="about-hero-badge"><i className="fas fa-layer-group"></i> Resources</div>
                    <h1 className="about-hero-title">Practice Library</h1>
                    <p className="about-hero-subtitle">Premium, high-resolution geographic resources to elevate your practice and conquer every exam.</p>
                </div>

                <div className="downloads-grid-aesthetic">
                    {downloadsData.map((item, index) => (
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
                                <a href={item.downloadUrl} target="_blank" rel="noreferrer" className="dl-premium-btn">
                                    <span>Download Resource</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * Modal for selecting a geographic category (e.g., Dams, Airports).
 */
export const CategoryModal = ({ isOpen, onClose, categories, activeTitle, onSelect }: { isOpen: boolean, onClose: () => void, categories: MapCategory[], activeTitle: string, onSelect: (title: string) => void }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-backdrop-new" onClick={onClose}>
            <div className="modal-card-aesthetic topic-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-aesthetic-header">
                    <div className="modal-aesthetic-shape shape-1"></div>
                    <div className="modal-aesthetic-shape shape-2"></div>
                    <div className="header-icon-wrapper-aesthetic">
                        <i className="fas fa-layer-group"></i>
                    </div>
                    <h3 className="modal-aesthetic-title">Select Topic</h3>
                    <p className="modal-aesthetic-subtitle">Choose a map category to practice or take a quiz.</p>
                    <button className="close-btn-aesthetic" onClick={onClose}><i className="fas fa-times"></i></button>
                </div>
                <div className="cat-grid-aesthetic">
                    {categories.map((cat, idx) => (
                        <button 
                            key={idx} 
                            className={`cat-card-aesthetic glass-card ${activeTitle === cat.title ? 'active' : ''}`}
                            onClick={() => { onSelect(cat.title); onClose(); }}
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
export const CalibrationExportModal = ({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: MapCategory[] }) => {
    if (!isOpen) return null;

    const dataString = `const mapData = ${JSON.stringify(data, (key, value) => {
        if (key === 'coords') {
            return JSON.parse(JSON.stringify(value).replace(/\\"/g, '"'));
        }
        return value;
    }, 2)
    .replace(/"coords": {\s+"x": (\d+),\s+"y": (\d+)\s+}/g, '"coords": { "x": $1, "y": $2 }')};`;
    
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(dataString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-card" style={{maxWidth: '800px', height: '80vh'}} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Export Calibrated Data</h3>
                    <button onClick={onClose}><i className="fas fa-times"></i></button>
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
                     <button className="dl-action-btn" style={{width: 'auto'}} onClick={handleCopy}>
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
export const QuizSummary = ({ isOpen, onClose, score, total, mistakes, onRetry, onNextTopic }: { isOpen: boolean, onClose: () => void, score: number, total: number, mistakes: MapLocation[], onRetry: () => void, onNextTopic: () => void }) => {
    if (!isOpen) return null;
    const isPerfect = mistakes.length === 0 && total > 0;
    const correctAnswers = total - mistakes.length;

    return (
        <div className="modal-backdrop-new">
            <div className="summary-aesthetic-card glass-card">
                <div className={`summary-aesthetic-header ${isPerfect ? 'perfect' : ''}`}>
                    <div className="modal-aesthetic-shape shape-1"></div>
                    <div className="modal-aesthetic-shape shape-2"></div>
                    
                    <div className="summary-aesthetic-title-wrap">
                        <h2>{isPerfect ? 'Flawless Execution!' : 'Quiz Result'}</h2>
                        <div className="quiz-fraction-score">
                            <span className="quiz-fraction-correct">{correctAnswers}</span>
                            <span className="quiz-fraction-separator">/</span>
                            <span className="quiz-fraction-total">{total}</span>
                        </div>
                        <p>targets located securely.</p>
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
                    <button className="summary-btn-outline" onClick={onClose} title="Return to Map">
                        <i className="fas fa-map"></i>
                    </button>
                    <button className="summary-btn-secondary" onClick={onRetry} title="Relocate">
                        <i className="fas fa-redo"></i>
                    </button>
                    <button className="summary-btn-primary" onClick={onNextTopic} title="Next Topic">
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
export const LocationInfoModal = ({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: MapLocation & { icon?: string } | null }) => {
    if (!isOpen || !data) return null;
    return (
        <div className="location-info-overlay" onClick={onClose}>
            <div className="location-info-card animate-slide-up" onClick={e => e.stopPropagation()}>
                <button className="location-info-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                <div className="location-info-header">
                    <div className="location-info-icon">
                        <i className={`fas ${data.icon || 'fa-map-pin'}`}></i>
                    </div>
                    <div className="location-info-title-group">
                        <h3 className="location-info-title">{data.name}</h3>
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
export const CountdownOverlay = ({ count }: { count: number | null }) => {
    if (count === null) return null;
    return (
        <div className="countdown-overlay">
            <div className="countdown-number" key={count}>
                {count === 0 ? 'GO!' : count}
            </div>
        </div>
    );
};
