import React, { useState } from 'react';

/**
 * About Naksha Page.
 * Pure editorial typography layout without cards, boxes, or block wrappers.
 */
export const InfoPage: React.FC = () => {
    const [imgFailed, setImgFailed] = useState(false);

    return (
        <div className="page-wrapper new-design-bg">
            <div className="page-content animate-slide-up" style={{ maxWidth: '720px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
                
                {/* Hero / Header */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-primary)', marginBottom: '0.75rem' }}>
                        Open Source Platform
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.75rem', fontWeight: 800, color: 'var(--c-text-main)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 1rem 0' }}>
                        Discover India's Geography
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: 'var(--c-text-secondary)', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                        Naksha is a modern, interactive map-learning platform designed to make geography intuitive, gamified, and seriously fun.
                    </p>
                    <a 
                        href="https://github.com/pradumon14/naksha" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1.25rem',
                            borderRadius: '10px',
                            background: '#0f172a',
                            color: 'white',
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        <i className="fab fa-github"></i> Star on GitHub
                    </a>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2.5rem 0' }} />

                {/* Creator & Engineer Section */}
                <div style={{ marginBottom: '2.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #e2e8f0' }}>
                            {!imgFailed ? (
                                <img 
                                    src="https://avatars.githubusercontent.com/u/192296069?v=4" 
                                    alt="Pradumon Sahani" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={() => setImgFailed(true)}
                                />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#0f172a', color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>
                                    PS
                                </div>
                            )}
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--c-primary)', marginBottom: '0.2rem' }}>
                                Creator &amp; Engineer
                            </span>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-text-main)', margin: '0 0 0.35rem 0' }}>
                                Pradumon Sahani
                            </h2>
                            <p style={{ fontSize: '0.88rem', color: 'var(--c-text-secondary)', margin: 0 }}>
                                Full Stack Developer &middot; Security Researcher
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <a 
                            href="https://github.com/pradumon14" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ color: 'var(--c-text-secondary)', fontSize: '1.1rem', textDecoration: 'none' }}
                            aria-label="GitHub Profile"
                            title="GitHub"
                        >
                            <i className="fab fa-github"></i>
                        </a>
                        <a 
                            href="https://linkedin.com/in/pradumon14" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ color: 'var(--c-text-secondary)', fontSize: '1.1rem', textDecoration: 'none' }}
                            aria-label="LinkedIn Profile"
                            title="LinkedIn"
                        >
                            <i className="fab fa-linkedin"></i>
                        </a>
                        <a 
                            href="https://pradumon.in" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ color: 'var(--c-text-secondary)', fontSize: '1.1rem', textDecoration: 'none' }}
                            aria-label="Personal Portfolio"
                            title="Portfolio"
                        >
                            <i className="fas fa-globe"></i>
                        </a>
                    </div>

                    <p style={{ fontSize: '1.05rem', color: 'var(--c-text-main)', lineHeight: 1.75, margin: '0 0 1.25rem 0' }}>
                        I am a Full Stack Developer and Security Researcher currently diving into AI security research. I have a passion for finding vulnerabilities and have successfully discovered and reported bugs in platforms like Meta and Google.
                    </p>
                    <p style={{ fontSize: '1.05rem', color: 'var(--c-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                        I built Naksha to transform static textbook maps into an interactive playground. By combining high-performance rendering with gamification, Naksha turns standard educational curriculums into an immersive spatial experience.
                    </p>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2.5rem 0' }} />

                {/* The 4 Sections (Continuous Editorial Flow, No Blocks) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', marginBottom: '3.5rem' }}>
                    
                    {/* The Vision */}
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--c-text-main)', margin: '0 0 0.5rem 0' }}>
                            The Vision
                        </h3>
                        <p style={{ fontSize: '1.02rem', color: 'var(--c-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                            To democratize spatial education by turning dry syllabus requirements into a highly engaging, interactive, and beautifully designed visual experience for students across India.
                        </p>
                    </div>

                    {/* Gamified Learning */}
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--c-text-main)', margin: '0 0 0.5rem 0' }}>
                            Gamified Learning
                        </h3>
                        <p style={{ fontSize: '1.02rem', color: 'var(--c-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                            We replaced standard studying with gamified challenges. Earn points, build streaks, and unlock a sense of achievement as you master India's geographical landscape.
                        </p>
                    </div>

                    {/* Open Source Framework */}
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--c-text-main)', margin: '0 0 0.5rem 0' }}>
                            Open Source Framework
                        </h3>
                        <p style={{ fontSize: '1.02rem', color: 'var(--c-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                            Naksha is entirely open-source. Free, transparent, and driven by community contributions, because we believe powerful educational tools belong to the learners who use them.
                        </p>
                    </div>

                    {/* Precision & Performance */}
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--c-text-main)', margin: '0 0 0.5rem 0' }}>
                            Precision &amp; Performance
                        </h3>
                        <p style={{ fontSize: '1.02rem', color: 'var(--c-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                            Engineered with a custom, ultra-lightweight SVG rendering engine utilizing React and TypeScript. This ensures a seamless, sub-millisecond response time without relying on heavy external mapping libraries.
                        </p>
                    </div>

                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2.5rem 0' }} />

                {/* Footer */}
                <div style={{ color: 'var(--c-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: 'var(--c-text-secondary)' }}>
                        Developed by Pradumon Sahani
                    </p>
                    <p style={{ margin: 0 }}>
                        &copy; 2026 Naksha&trade;. All rights reserved.
                    </p>
                </div>

            </div>
        </div>
    );
};
