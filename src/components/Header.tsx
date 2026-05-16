import React, { useState, useEffect } from 'react';

/**
 * Application Header component.
 * Handles top-level navigation and responsive mobile menu.
 */
export const Header = ({ onNavigate, activePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    if (activePage !== 'map') {
      window.addEventListener('scroll', handleScroll);
      // Run on mount to check initial position
      handleScroll();
    } else {
      setScrolled(false);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activePage]);

  const navLinks = [
    { name: 'Practice', page: 'map' },
    { name: 'Downloads', page: 'downloads' },
    { name: 'Support', page: 'support' },
    { name: 'About', page: 'info' },
  ];

  const handleNav = (page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <div className="new-header-container">
      <header className={`new-header ${scrolled && activePage !== 'map' ? 'scrolled' : ''}`}>
        <div className="new-header-content">
          <div className="brand" onClick={() => handleNav('map')}>
            <div className="brand-icon"><i className="fas fa-map-location-dot"></i></div>
            <span>Naksha</span>
          </div>

          <nav className="new-header-nav-desktop">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => handleNav(link.page)}
                className={`new-header-nav-btn ${activePage === link.page ? 'active' : ''}`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          <button 
              className="new-header-mobile-btn" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
          >
              {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
          </button>
        </div>

        {isOpen && (
            <div className="new-mobile-menu">
                <nav className="new-mobile-menu-nav-list">
                    {navLinks.map((link) => (
                    <button 
                        key={link.name} 
                        onClick={() => handleNav(link.page)}
                        className={`new-mobile-menu-nav-item ${activePage === link.page ? 'active' : ''}`}
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
