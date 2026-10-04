import React, { useState, useEffect, useRef } from 'react';

export interface HeaderProps {
  onNavigate: (page: string) => void;
  activePage: string;
}

/**
 * Application Header component.
 * Handles top-level navigation and responsive mobile menu with full accessibility.
 */
export const Header: React.FC<HeaderProps> = ({ onNavigate, activePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    if (activePage !== 'map') {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    } else {
      setScrolled(false);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activePage]);

  // Close mobile menu on Escape key press or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Practice', page: 'map' },
    { name: 'Downloads', page: 'downloads' },
    { name: 'Support', page: 'support' },
    { name: 'About', page: 'info' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <div className="new-header-container">
      <header 
        ref={headerRef}
        className={`new-header ${scrolled && activePage !== 'map' ? 'scrolled' : ''}`}
      >
        <div className="new-header-content">
          <div 
            className="brand" 
            onClick={() => handleNav('map')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNav('map'); }}
            aria-label="Naksha Home"
          >
            <div className="brand-icon"><i className="fas fa-map-location-dot"></i></div>
            <span>Naksha</span>
          </div>

          <nav className="new-header-nav-desktop" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => handleNav(link.page)}
                className={`new-header-nav-btn ${activePage === link.page ? 'active' : ''}`}
                aria-current={activePage === link.page ? 'page' : undefined}
              >
                {link.name}
              </button>
            ))}
          </nav>

          <button 
            className="new-header-mobile-btn" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
          </button>
        </div>

        {isOpen && (
          <div className="new-mobile-menu" id="mobile-navigation">
            <nav className="new-mobile-menu-nav-list" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => handleNav(link.page)}
                  className={`new-mobile-menu-nav-item ${activePage === link.page ? 'active' : ''}`}
                  aria-current={activePage === link.page ? 'page' : undefined}
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};
