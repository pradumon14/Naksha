import React, { useState } from 'react';

/**
 * Support/Donation page component.
 * Aesthetic, flat design consistent with the Downloads and About pages.
 * Features:
 * - Red heart in header icon ring and impact section
 * - Original laser scanner effect on QR code
 * - Zero emojis (FontAwesome icons throughout)
 * - Payee name (Pradumon Sahani) clean above QR
 * - High-impact, compelling student-focused content with unified aesthetic styling
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
                    {/* Left column: QR scanner with Payee Name above QR */}
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
                            <i className="fas fa-qrcode"></i> Scan with any UPI App in India
                        </p>

                        <div className="upi-apps">
                            <span className="upi-app-badge">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                                    <path d="M23.49 12.275c0-.85-.075-1.67-.215-2.455H12v4.64h6.445a5.51 5.51 0 0 1-2.39 3.61v3.005h3.87c2.265-2.085 3.565-5.155 3.565-8.8z" fill="#4285F4"/>
                                    <path d="M12 24c3.24 0 5.96-1.075 7.945-2.925l-3.87-3.005c-1.075.72-2.45 1.145-4.075 1.145-3.135 0-5.79-2.115-6.74-4.96H1.245v3.095C3.23 21.24 7.31 24 12 24z" fill="#34A853"/>
                                    <path d="M5.26 14.255c-.245-.72-.385-1.49-.385-2.255s.14-1.535.385-2.255V6.65H1.245A11.96 11.96 0 0 0 0 12c0 1.93.46 3.765 1.245 5.35l4.015-3.095z" fill="#FBBC05"/>
                                    <path d="M12 4.75c1.765 0 3.35.605 4.595 1.795l3.445-3.445C17.955 1.19 15.235 0 12 0 7.31 0 3.23 2.76 1.245 6.65l4.015 3.095c.95-2.845 3.605-4.995 6.74-4.995z" fill="#EA4335"/>
                                </svg>
                                <span>GPay</span>
                            </span>
                            <span className="upi-app-badge">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                                    <rect width="24" height="24" rx="5" fill="#5f259f"/>
                                    <path d="M6.5 7.5h6.5c1.9 0 3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5H9.5v5H6.5v-12zm3 4.5h3.5c.6 0 1-.4 1-1s-.4-1-1-1H9.5v2z" fill="#ffffff"/>
                                    <path d="M13.8 13.5l3.5 5.5h-3l-2.6-4.2" fill="#ffffff"/>
                                    <path d="M14.5 4.5l-4 3" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>
                                <span>PhonePe</span>
                            </span>
                            <span className="upi-app-badge">
                                <svg width="30" height="13" viewBox="0 0 32 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                                    <rect width="32" height="14" rx="3" fill="#f0f7ff" stroke="#bae6fd" strokeWidth="0.8"/>
                                    <text x="2.5" y="10" fontFamily="Inter, -apple-system, sans-serif" fontWeight="900" fontSize="8.5" fill="#002e6e" letterSpacing="-0.5">Pay</text>
                                    <text x="18.5" y="10" fontFamily="Inter, -apple-system, sans-serif" fontWeight="900" fontSize="8.5" fill="#00baf2" letterSpacing="-0.5">tm</text>
                                </svg>
                                <span>Paytm</span>
                            </span>
                            <span className="upi-app-badge">
                                <svg width="18" height="13" viewBox="0 0 24 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                                    <path d="M7 2L1 14h4.5l1.8-4.5 3 4.5h4.7L7 2z" fill="#097939"/>
                                    <path d="M13.5 2l-3.5 7 3.5 5h5L22 2h-8.5z" fill="#ed7524"/>
                                </svg>
                                <span>BHIM UPI</span>
                            </span>
                        </div>
                    </div>

                    {/* Right column: UPI Details and Impact */}
                    <div className="payment-details-section">
                        {/* Direct UPI Box without Active & Verified */}
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

                        {/* Enhanced Aesthetic Impact Section */}
                        <div className="impact-section-aesthetic">
                            <h4 className="impact-title-aesthetic">
                                <i className="fas fa-heart" style={{ color: '#dc2626' }}></i> Where does your support go?
                            </h4>
                            <div className="impact-rows">
                                <div className="impact-row">
                                    <div className="impact-row-icon">
                                        <i className="fas fa-server"></i>
                                    </div>
                                    <div className="impact-row-body">
                                        <h5>Fast Vector Servers & CDN</h5>
                                        <p>Ensures smooth, instantaneous map zoom and GeoJSON tile rendering across all Indian states.</p>
                                    </div>
                                </div>

                                <div className="impact-row">
                                    <div className="impact-row-icon">
                                        <i className="fas fa-shield-halved"></i>
                                    </div>
                                    <div className="impact-row-body">
                                        <h5>100% Ad-Free & Distraction-Free</h5>
                                        <p>Students study without intrusive commercial banners, popups, or tracking during exam preparation.</p>
                                    </div>
                                </div>

                                <div className="impact-row">
                                    <div className="impact-row-icon">
                                        <i className="fas fa-book-open"></i>
                                    </div>
                                    <div className="impact-row-body">
                                        <h5>CBSE Board Syllabus Alignment</h5>
                                        <p>Continuous verification of dams, power plants, and ports against the latest NCERT guidelines.</p>
                                    </div>
                                </div>

                                <div className="impact-row">
                                    <div className="impact-row-icon">
                                        <i className="fas fa-file-arrow-down"></i>
                                    </div>
                                    <div className="impact-row-body">
                                        <h5>Free Printable Outlines</h5>
                                        <p>Powers the generation and distribution of high-resolution printable outline maps for classroom revision.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="impact-callout-pill">
                                <i className="fas fa-hand-holding-heart" style={{ color: '#dc2626' }}></i>
                                <span>Even <strong>₹20</strong> or <strong>₹50</strong> goes directly toward keeping Naksha online, fast, and free for every student.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
