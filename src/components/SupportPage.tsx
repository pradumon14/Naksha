import React, { useState } from 'react';

/**
 * Support/Donation page component.
 * Provides UPI payment details and QR code for project support.
 */
export const SupportPage = () => {
    const upiId = "pradumm@fam";
    const upiLink = `upi://pay?pa=${upiId}&pn=Naksha%20Support&cu=INR`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(upiLink)}`;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="page-wrapper new-design-bg">
            <div className="page-content animate-slide-up support-content">
                <div className="support-header">
                    <div className="support-icon-ring">
                        <i className="fas fa-seedling"></i>
                    </div>
                    <div className="about-hero-badge" style={{ margin: '0 auto 1rem', display: 'inline-flex' }}>Community Backed</div>
                    <h1 className="support-title">Keep Naksha Free</h1>
                    <p className="support-subtitle">Naksha is a passion project built for students. I don't run ads or sell your data. Your support directly helps cover server costs and fuels future development of new maps and features.</p>
                </div>

                <div className="support-main-card glass-card">
                    <div className="support-split">
                        <div className="qr-section">
                            <div className="qr-frame-modern">
                                <img src={qrUrl} alt="UPI QR Code" className="qr-image" />
                                <div className="qr-scan-line"></div>
                            </div>
                            <p className="scan-text">Scan with any UPI App in India</p>
                            <div className="upi-apps">
                                <span className="upi-app-badge"><i className="fab fa-google-pay"></i> GPay</span>
                                <span className="upi-app-badge"><i className="fas fa-store"></i> PhonePe</span>
                                <span className="upi-app-badge"><i className="fas fa-wallet"></i> Paytm</span>
                            </div>
                        </div>
                        
                        <div className="payment-details-section">
                            <h3 className="section-title-aesthetic">Or use Direct UPI</h3>
                            <div className="upi-id-box-modern">
                                <span className="upi-label">My UPI ID</span>
                                <div className="upi-value-row">
                                    <code className="upi-code-modern">{upiId}</code>
                                    <button onClick={handleCopy} className={`copy-btn-modern ${copied ? 'copied' : ''}`} title="Copy UPI ID">
                                        {copied ? <><i className="fas fa-check"></i> Copied!</> : <><i className="far fa-copy"></i> Copy</>}
                                    </button>
                                </div>
                            </div>
                            
                            <a href={upiLink} className="mobile-pay-btn-modern hide-on-desktop">
                                <i className="fas fa-bolt"></i> Tap to Pay on Mobile
                            </a>

                            <div className="impact-list-modern">
                                <h4><i className="fas fa-heart" style={{color: '#e11d48'}}></i> Where does your support go?</h4>
                                <ul>
                                    <li>
                                        <div className="impact-icon"><i className="fas fa-server"></i></div>
                                        <div className="impact-text">
                                            <strong>Infrastructure</strong>
                                            <span>Keeps the servers running and domains active.</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="impact-icon"><i className="fas fa-coffee"></i></div>
                                        <div className="impact-text">
                                            <strong>Development Fuel</strong>
                                            <span>Coffee to power late-night coding sessions.</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="impact-icon"><i className="fas fa-shield-alt"></i></div>
                                        <div className="impact-text">
                                            <strong>Ad-Free Experience</strong>
                                            <span>Ensures students learn without distractions.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <p className="support-thank-you">
                                Even ₹50 helps immensely. Thank you for supporting open-source tools!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
