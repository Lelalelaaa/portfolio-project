import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/* Active section tracker using IntersectionObserver */
const useActiveSection = () => {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'contact'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);
  return active;
};

const Navbar = () => {
  const [scrolled, setScrolled]  = useState(false);
  const [menuOpen, setMenuOpen]  = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogoClick = () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links = [
    { href: '/#about',    label: 'About',    id: 'about' },
    { href: '/#projects', label: 'Projects', id: 'projects' },
    { href: '/#contact',  label: 'Contact',  id: 'contact' },
  ];

  return (
    <>
      <nav
        className="navbar"
        style={{ boxShadow: scrolled ? '0 2px 24px rgba(44,54,37,0.10)' : 'none' }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar-inner">
          {/* Logo — leftmost element anchors F-pattern top bar */}
          <Link
            to="/"
            onClick={handleLogoClick}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
            aria-label="Chau Senghong — home"
          >
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.5px',
            }}>
              CSH
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              display: 'none',
            }}
              className="nav-subtitle">
              SE
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="nav-links" role="list">
            {links.map(({ href, label, id }) => (
              <li key={id}>
                {/* Feedback: active class highlights current section */}
                <a
                  href={href}
                  className={activeSection === id ? 'active' : ''}
                  aria-current={activeSection === id ? 'page' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger — signifier: three lines universally recognised */}
          <button
            className="hamburger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'none' }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer — slide in from top */}
      <div
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Mobile navigation"
      >
        {links.map(({ href, label, id }) => (
          <a
            key={id}
            href={href}
            onClick={closeMenu}
            style={{ color: activeSection === id ? 'var(--primary-color)' : undefined }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Accessible style for nav subtitle on wider screens */}
      <style>{`
        @media (min-width: 480px) { .nav-subtitle { display: inline !important; } }
      `}</style>
    </>
  );
};

export default Navbar;
