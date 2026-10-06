import React, { useState } from 'react';

/**
 * Support/Donation page component.
 * Premium, flat design consistent with the Downloads and About pages.
 * Features:
 * - Red heart in header icon ring and impact section
 * - Original laser scanner effect on QR code
 * - Zero emojis (FontAwesome icons throughout)
 * - Payee name (Pradumon Sahani) clean above QR
 * - Generalized UPI chips (no brand logos)
 * - Spacious, high-impact breakdown styled like Downloads page resource rows
 * - Completely flat layout without 3D card wrappers or hover lift
 */
export const SupportPage: React.FC = () => {
    const upiId = "pradumon14@slc";
    const upiLink = `upi://pay?pa=${upiId}&pn=Naksha%20Support&cu=INR`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(upiLink)}`;
    const [copied, setCopied] = useState(false);
    const [qrFailed, setQrFailed] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(upiId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="page-wrapper new-design-bg">
            <div className="page-content animate-slide-up support-content">
                {/* Header matching DownloadsPage layout */}
                <div className="support-header">
                    <div className="support-icon-ring" style={{ background: '#fee2e2', color: '#dc2626' }}>
                        <i className="fas fa-heart" style={{ color: '#dc2626' }}></i>
                    </div>
                    <div className="about-hero-badge" style={{ margin: '0 auto 1rem', display: 'inline-flex' }}>
                        Community Backed
                    </div>
                    <h1 className="support-title">Keep Naksha Free</h1>
                    <p className="support-subtitle">
                        Naksha is a passion project built for students. I don't run ads or sell your data.
                        Your support directly helps cover server costs and fuels future development of new maps and features.
                    </p>
                </div>

                {/* Flat two-column layout directly on page (no enclosing card block) */}
                <div className="support-split">
                    {/* Left column: Payment & QR Portal */}
                    <div className="qr-section">
                        <h3 className="qr-payee-name">Pradumon Sahani</h3>

                        <div className="qr-frame-flat">
                            {!qrFailed ? (
                                <img 
                                    src={qrUrl} 
                                    alt={`UPI QR Code for ${upiId}`} 
                                    className="qr-image" 
                                    onError={() => setQrFailed(true)}
                                />
                            ) : (
                                <div className="qr-fallback-flat">
                                    <i className="fas fa-qrcode"></i>
                                    <p>Scan with any UPI app</p>
                                    <code>{upiId}</code>
                                </div>
                            )}
                            <div className="qr-scan-line"></div>
                        </div>

                        <p className="scan-text">
                            <i className="fas fa-qrcode"></i> Scan with any UPI app
                        </p>

                        {/* Generalized UPI chips (no brand logos) */}
                        <div className="upi-generalized-chips">
                            <span className="upi-chip">GPay</span>
                            <span className="upi-chip">PhonePe</span>
                            <span className="upi-chip">Paytm</span>
                            <span className="upi-chip">BHIM</span>
                            <span className="upi-chip">Any Bank UPI</span>
                        </div>

                        {/* Direct UPI Box */}
                        <div className="upi-id-box-flat">
                            <span className="upi-label">Direct UPI ID</span>
                            <div className="upi-value-row">
                                <code className="upi-code-modern">{upiId}</code>
                                <button 
                                    onClick={handleCopy} 
                                    className={`copy-btn-modern ${copied ? 'copied' : ''}`} 
                                    title="Copy UPI ID"
                                    aria-label="Copy UPI ID"
                                >
                                    {copied ? (
                                        <>
                                            <i className="fas fa-check"></i> Copied!
                                        </>
                                    ) : (
                                        <>
                                            <i className="far fa-copy"></i> Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <a href={upiLink} className="mobile-pay-btn-flat hide-on-desktop">
                            <i className="fas fa-bolt"></i> Tap to Pay on Mobile
                        </a>
                    </div>

                    {/* Right column: Where does your support go? */}
                    <div className="support-impact-column">
                        <div className="impact-section-header">
                            <div className="about-hero-badge" style={{ display: 'inline-flex', marginBottom: '0.65rem' }}>
                                <i className="fas fa-heart" style={{ color: '#dc2626', marginRight: '6px' }}></i> 100% Student Powered
                            </div>
                            <h2 className="impact-section-title">Where does your support go?</h2>
                            <p className="impact-section-subtitle">
                                Every rupee directly funds free learning infrastructure and educational tools for students across India.
                            </p>
                        </div>

                        <div className="impact-items-list">
                            <div className="impact-item-row">
                                <div className="impact-item-icon-box">
                                    <i className="fas fa-server"></i>
                                </div>
                                <div className="impact-item-content">
                                    <h4>Fast Vector Servers & CDN</h4>
                                    <p>Ensures smooth, instantaneous map zoom and GeoJSON tile rendering across all Indian states.</p>
                                </div>
                            </div>

                            <div className="impact-item-row">
                                <div className="impact-item-icon-box">
                                    <i className="fas fa-shield-halved"></i>
                                </div>
                                <div className="impact-item-content">
                                    <h4>100% Ad-Free & Distraction-Free</h4>
                                    <p>Students study without intrusive commercial banners, popups, or tracking during exam preparation.</p>
                                </div>
                            </div>

                            <div className="impact-item-row">
                                <div className="impact-item-icon-box">
                                    <i className="fas fa-graduation-cap"></i>
                                </div>
                                <div className="impact-item-content">
                                    <h4>CBSE Board Syllabus Alignment</h4>
                                    <p>Continuous verification of dams, power plants, and ports against the latest NCERT guidelines.</p>
                                </div>
                            </div>

                            <div className="impact-item-row">
                                <div className="impact-item-icon-box">
                                    <i className="fas fa-file-arrow-down"></i>
                                </div>
                                <div className="impact-item-content">
                                    <h4>Free Printable Outlines</h4>
                                    <p>Powers the generation and distribution of high-resolution printable outline maps for classroom revision.</p>
                                </div>
                            </div>
                        </div>

                        <div className="impact-note-banner">
                            <div className="impact-note-icon">
                                <i className="fas fa-hand-holding-heart" style={{ color: '#dc2626' }}></i>
                            </div>
                            <div className="impact-note-text">
                                <strong>Every contribution makes a difference</strong>
                                <p>Even ₹20 or ₹50 goes directly toward keeping Naksha online, fast, and free for every student.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
