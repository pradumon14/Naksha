import React, { useState, useEffect, useMemo } from 'react';
import { MapCategory, DownloadItem, MapLocation } from '../types';

/**
 * Clean, text-minimal Downloads page.
 * Uses the proven SupportPage layout system with clean rows and direct download buttons.
 */
export const DownloadsPage: React.FC<{ downloadsData: DownloadItem[] }> = ({ downloadsData }) => {
    const [filter, setFilter] = useState<'all' | 'syllabus' | 'outlines' | 'physical' | 'history'>('all');

    const filteredItems = useMemo(() => {
        if (filter === 'all') return downloadsData;
        return downloadsData.filter(item => 
            item.category === filter || 
            (filter === 'syllabus') || 
            (filter === 'outlines' && item.type === 'political') ||
            (filter === 'physical' && (item.type === 'physical' || item.type === 'water')) ||
            (filter === 'history' && item.type === 'history')
        );
    }, [downloadsData, filter]);

    return (
        <div className="page-wrapper new-design-bg">
            <div className="page-content animate-slide-up support-content">
                {/* Clean Header matching SupportPage */}
                <div className="support-header">
                    <div className="support-icon-ring" style={{ background: 'linear-gradient(135deg, #ccfbf1, #99f6e4)', color: '#0f766e' }}>
                        <i className="fas fa-file-arrow-down"></i>
                    </div>
                    <div className="about-hero-badge" style={{ margin: '0 auto 1rem', display: 'inline-flex' }}>Printable Revision Maps</div>
                    <h1 className="support-title">Map Downloads</h1>
                    <p className="support-subtitle">High-resolution outline maps and reference templates for Class 10 geography.</p>
                </div>

                {/* Filter Pills */}
                <div className="upi-apps" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
                    {[
                        { id: 'all', label: 'All Maps' },
                        { id: 'syllabus', label: 'Syllabus' },
                        { id: 'outlines', label: 'Outlines' },
                        { id: 'physical', label: 'Physical' },
                        { id: 'history', label: 'History' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className="upi-app-badge"
                            style={{ 
                                cursor: 'pointer', 
                                background: filter === tab.id ? 'var(--c-primary)' : 'white',
                                color: filter === tab.id ? 'white' : 'var(--c-text-secondary)',
                                borderColor: filter === tab.id ? 'var(--c-primary)' : '#e2e8f0',
                                padding: '0.45rem 1rem',
                                fontWeight: 600,
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => setFilter(tab.id as any)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Clean, Text-Minimal Resource Rows */}
                <div className="downloads-list">
                    {filteredItems.map((item, idx) => (
                        <div key={item.id || idx} className="resource-row glass-card" style={{ alignItems: 'center' }}>
                            <div className="resource-icon-box">
                                <i className={`fas ${item.icon || 'fa-map'}`}></i>
                            </div>
                            <div className="resource-info">
                                <div className="resource-title-row" style={{ marginBottom: 0 }}>
                                    <h3>{item.title}</h3>
                                    <span className="resource-size">{item.format || 'PDF'} &bull; {item.size}</span>
                                </div>
                            </div>
                            <div className="resource-action">
                                {item.downloadUrl && item.downloadUrl !== '#' ? (
                                    <a 
                                        href={item.downloadUrl} 
                                        download 
                                        className="download-btn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ minWidth: '130px', padding: '0.65rem 1.25rem' }}
                                    >
                                        <i className="fas fa-arrow-down"></i> Download
                                    </a>
                                ) : (
                                    <span 
                                        className="download-btn disabled"
                                        style={{ minWidth: '130px', padding: '0.65rem 1.25rem' }}
                                    >
                                        Coming Soon
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * Lightweight, elegant Spotlight Category Palette.
 * Fast, distraction-free search and keyboard-friendly navigation.
 */
export const CategoryModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    categories: MapCategory[];
    activeTitle: string;
    onSelect: (title: string) => void;
}> = ({ isOpen, onClose, categories, activeTitle, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;
        const q = searchQuery.toLowerCase();
        return categories.filter(cat => 
            cat.title.toLowerCase().includes(q) ||
            cat.locations.some(loc => loc.name.toLowerCase().includes(q) || loc.state.toLowerCase().includes(q))
        );
    }, [categories, searchQuery]);

    if (!isOpen) return null;

    return (
        <div className="spotlight-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="spotlight-card" onClick={e => e.stopPropagation()}>
                <div className="spotlight-search-row">
                    <i className="fas fa-search spotlight-search-icon"></i>
                    <input 
                        type="text" 
                        placeholder="Search topics or places (e.g. Mumbai, Iron Ore, Dams)..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="spotlight-search-input"
                        autoFocus
                    />
                    {searchQuery && (
                        <button className="spotlight-clear-btn" onClick={() => setSearchQuery('')} aria-label="Clear search">
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                    <span className="spotlight-esc-pill" onClick={onClose}>esc</span>
                </div>

                <div className="spotlight-list" role="listbox">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((cat, idx) => {
                            const isActive = activeTitle === cat.title;
                            return (
                                <button
                                    key={idx}
                                    className={`spotlight-item ${isActive ? 'active' : ''}`}
                                    onClick={() => { onSelect(cat.title); onClose(); }}
                                    role="option"
                                    aria-selected={isActive}
                                >
                                    <div className="spotlight-item-icon">
                                        <i className={`fas ${cat.icon}`}></i>
                                    </div>
                                    <div className="spotlight-item-title">
                                        {cat.title}
                                    </div>
                                    <div className="spotlight-item-meta">
                                        {cat.locations.length} sites
                                    </div>
                                    {isActive && (
                                        <div className="spotlight-active-dot"></div>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="spotlight-empty">
                            No topics found for "{searchQuery}"
                        </div>
                    )}
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
 * Minimalist Quiz Summary modal.
/**
 * Modern Quiz Report & Result Menu.
 * Aesthetic presentation with celebratory badge, 4-metric breakdown, review list, and responsive action controls.
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
    const correctCount = Math.max(0, total - mistakes.length);
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return (
        <div className="spotlight-overlay" role="dialog" aria-modal="true" aria-labelledby="quiz-report-title">
            <div className="quiz-report-card">
                
                {/* Header Icon Ring */}
                <div className={`quiz-report-icon-ring ${isPerfect ? 'perfect' : accuracy >= 70 ? 'great' : 'practice'}`}>
                    <i className={`fas ${isPerfect ? 'fa-trophy' : accuracy >= 70 ? 'fa-medal' : 'fa-graduation-cap'}`}></i>
                </div>

                <div className={`quiz-report-badge ${isPerfect ? 'perfect' : accuracy >= 70 ? 'great' : 'practice'}`}>
                    {isPerfect ? <><i className="fas fa-star" style={{ marginRight: '4px' }}></i> 100% Mastered</> : accuracy >= 70 ? `${accuracy}% Strong Knowledge` : `${accuracy}% Keep Practicing`}
                </div>

                <h2 id="quiz-report-title" className="quiz-report-title">
                    {isPerfect ? 'Flawless Run!' : accuracy >= 70 ? 'Great Progress!' : 'Round Completed'}
                </h2>

                <p className="quiz-report-subtitle">
                    {isPerfect 
                        ? 'You identified every location with zero mistakes. Outstanding spatial memory!' 
                        : accuracy >= 70 
                            ? 'Solid understanding of this topic. Review the missed locations below to reach 100%.' 
                            : 'Consistent practice is key to mastering Indian geography. Check the review list below.'}
                </p>

                {/* 4-Stat Metric Grid */}
                <div className="quiz-report-grid">
                    <div className="quiz-report-metric">
                        <span className="metric-val score">+{score}</span>
                        <span className="metric-label">Points</span>
                    </div>
                    <div className="quiz-report-metric">
                        <span className="metric-val accuracy">{accuracy}%</span>
                        <span className="metric-label">Accuracy</span>
                    </div>
                    <div className="quiz-report-metric">
                        <span className="metric-val correct">{correctCount}/{total}</span>
                        <span className="metric-label">Correct</span>
                    </div>
                    <div className="quiz-report-metric">
                        <span className="metric-val mistakes">{mistakes.length}</span>
                        <span className="metric-label">Mistakes</span>
                    </div>
                </div>

                {/* Mistakes Review List */}
                {mistakes.length > 0 && (
                    <div className="quiz-report-review">
                        <div className="review-header">
                            <i className="fas fa-search-location"></i>
                            <span>Locations to Review ({mistakes.length})</span>
                        </div>
                        <div className="review-tags-list">
                            {mistakes.map((m, i) => (
                                <div key={i} className="review-tag-chip">
                                    <span className="chip-name">{m.name}</span>
                                    <span className="chip-state">{m.state}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="quiz-report-actions">
                    <button className="report-btn primary" onClick={onRetry}>
                        <i className="fas fa-redo"></i> Try Again
                    </button>
                    <button className="report-btn secondary" onClick={onNextTopic}>
                        Next Topic <i className="fas fa-chevron-right"></i>
                    </button>
                </div>

                <button className="quiz-report-close-link" onClick={onClose}>
                    Return to Map Practice
                </button>

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
