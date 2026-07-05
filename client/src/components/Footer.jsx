import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--text-main)',
      color: 'var(--bg-color)',
      paddingTop: '4rem',
    }}>

      {/* Main footer grid */}
      <div style={{
        padding: '0 6%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        paddingBottom: '3rem',
        borderBottom: '1px solid rgba(249,246,240,0.12)',
      }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 800,
              fontSize: '1.4rem',
              letterSpacing: '-0.5px',
            }}>
              CSH
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.75, opacity: 0.65, maxWidth: '220px' }}>
            Software Engineering student at CamTech University, building clean and user-centred web applications.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--primary-color)',
            marginBottom: '1.25rem',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            Navigation
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { href: '/#about',    label: 'About Me' },
              { href: '/#projects', label: 'Projects' },
              { href: '/#contact',  label: 'Contact' },
            ].map(({ href, label }) => (
              <li key={href}>
                <a href={href} style={{
                  color: 'rgba(249,246,240,0.65)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--bg-color)'}
                  onMouseLeave={e => e.target.style.color = 'rgba(249,246,240,0.65)'}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--primary-color)',
            marginBottom: '1.25rem',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            Contact
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { icon: <MapPin size={15} />, text: 'Phnom Penh, Cambodia' },
              { icon: <Phone size={15} />,  text: '+855 14 545 654' },
              { icon: <Mail size={15} />,   text: 'senghongchau@gmail.com' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(249,246,240,0.65)', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--primary-color)', flexShrink: 0 }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Stack used */}
        <div>
          <h4 style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--primary-color)',
            marginBottom: '1.25rem',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            Built With
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['React', 'Node.js', 'MongoDB', 'Express', 'Vite', 'Framer Motion'].map(tech => (
              <span key={tech} style={{
                padding: '0.25rem 0.65rem',
                border: '1px solid rgba(249,246,240,0.18)',
                borderRadius: '100px',
                fontSize: '0.75rem',
                color: 'rgba(249,246,240,0.65)',
                fontWeight: 600,
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        padding: '1.25rem 6%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <p style={{ fontSize: '0.82rem', opacity: 0.45 }}>
          © {year} Chau Senghong. All rights reserved.
        </p>
        <p style={{ fontSize: '0.82rem', opacity: 0.45 }}>
          Web Development Final Assessment — CamTech University
        </p>
      </div>

    </footer>
  );
};

export default Footer;
