import React from 'react';

/**
 * About/Info page component.
 * Displays project mission, author profile, and technical details.
 */
export const InfoPage = () => (
    <div className="page-wrapper new-design-bg">
        <div className="page-content animate-slide-up about-page-content">
            
            {/* Hero Section */}
            <div className="about-hero">
                <div className="about-hero-badge">Open Source Platform</div>
                <h1 className="about-hero-title">Discover India's Geography</h1>
                <p className="about-hero-subtitle">
                    Naksha is a modern, interactive map-learning platform designed to make geography intuitive, gamified, and seriously fun.
                </p>
                <div className="about-hero-actions">
                    <a href="https://github.com/pradumon14/naksha" target="_blank" rel="noreferrer" className="btn-primary-new">
                        <i className="fab fa-github"></i> Star on GitHub
                    </a>
                </div>
            </div>

            {/* Author Section */}
            <div className="author-profile-section-new">
                <div className="author-grid">
                    <div className="author-avatar-col">
                        <div className="avatar-glow-wrapper">
                            <img src="https://avatars.githubusercontent.com/u/192296069?v=4" alt="Pradumon Sahani" className="profile-avatar" />
                            <div className="online-badge"></div>
                        </div>
                        <div className="profile-socials-new">
                            <a href="https://github.com/pradumon14" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="GitHub"><i className="fab fa-github"></i></a>
                            <a href="https://linkedin.com/in/pradumon14" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                            <a href="https://pradumon.in" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Portfolio"><i className="fas fa-globe"></i></a>
                        </div>
                    </div>
                    <div className="author-info-col">
                        <div className="author-label">Creator & Engineer</div>
                        <h2 className="profile-name-new">Pradumon Sahani</h2>
                        <div className="profile-badges-new">
                            <span className="role-badge-new"><i className="fas fa-code"></i> Full Stack Developer</span>
                            <span className="role-badge-new"><i className="fas fa-shield-alt"></i> Security Researcher</span>
                        </div>
                        <p className="profile-bio-new">
                            I am a Full Stack Developer and Security Researcher currently diving into AI security research. I have a passion for finding vulnerabilities and have successfully discovered and reported bugs in platforms like Meta and Google.
                        </p>
                        <p className="profile-bio-new">
                            I built Naksha to transform static textbook maps into an interactive playground. By combining high-performance rendering with gamification, Naksha turns standard educational curriculums into an immersive spatial experience.
                        </p>
                    </div>
                </div>
            </div>

            {/* Project Documentation - Storytelling Layout */}
            <div className="about-story-section">
                <div className="story-item">
                    <div className="story-icon-wrapper">
                        <div className="story-icon"><i className="fas fa-eye"></i></div>
                        <div className="story-line"></div>
                    </div>
                    <div className="story-content">
                        <h3 className="story-title">The Vision</h3>
                        <p className="story-text">To democratize spatial education by turning dry syllabus requirements into a highly engaging, interactive, and beautifully designed visual experience for students across India.</p>
                    </div>
                </div>
                <div className="story-item">
                    <div className="story-icon-wrapper">
                        <div className="story-icon"><i className="fas fa-gamepad"></i></div>
                        <div className="story-line"></div>
                    </div>
                    <div className="story-content">
                        <h3 className="story-title">Gamified Learning</h3>
                        <p className="story-text">We replaced standard studying with gamified challenges. Earn points, build streaks, and unlock a sense of achievement as you master India's geographical landscape.</p>
                    </div>
                </div>
                <div className="story-item">
                    <div className="story-icon-wrapper">
                        <div className="story-icon"><i className="fas fa-code-branch"></i></div>
                        <div className="story-line"></div>
                    </div>
                    <div className="story-content">
                        <h3 className="story-title">Open Source Framework</h3>
                        <p className="story-text">Naksha is entirely open-source. Free, transparent, and driven by community contributions, because we believe powerful educational tools belong to the learners who use them.</p>
                    </div>
                </div>
                <div className="story-item">
                    <div className="story-icon-wrapper">
                        <div className="story-icon"><i className="fas fa-bolt"></i></div>
                    </div>
                    <div className="story-content">
                        <h3 className="story-title">Precision & Performance</h3>
                        <p className="story-text">Engineered with a custom, ultra-lightweight SVG rendering engine utilizing React and TypeScript. This ensures a seamless, sub-millisecond response time without relying on heavy external mapping libraries.</p>
                    </div>
                </div>
            </div>

            {/* Footer Tag */}
            <div className="about-copyright-tag">
                <p>
                    Developed by <strong>Pradumon Sahani</strong><br />
                    &copy; {new Date().getFullYear()} Naksha&trade;. All rights reserved.
                </p>
            </div>

        </div>
    </div>
);

