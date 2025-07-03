import React from 'react';

const footerStyle = {
  width: '100%',
  background: 'none',
  borderTop: '1px solid #e67e22',
  color: '#b9770e',
  textAlign: 'center',
  padding: '0.5rem 0 0.3rem 0',
  fontSize: '0.97rem',
  fontWeight: 400,
  letterSpacing: '0.01em',
  position: 'fixed',
  left: 0,
  bottom: 0,
  zIndex: 100,
  marginTop: 0,
  backgroundClip: 'padding-box',
  boxShadow: 'none',
};

const heartStyle = {
  display: 'inline-block',
  margin: '0 0.2em',
  fontSize: '1.05em',
  verticalAlign: 'middle',
  animation: 'blink-heart 1.2s infinite',
  filter: 'grayscale(0.2)',
};

const copyrightStyle = {
  display: 'block',
  color: '#b9770e',
  fontSize: '0.85rem',
  marginTop: '0.15rem',
  opacity: 0.6,
  letterSpacing: '0.01em',
};

const Footer = () => (
  <footer style={footerStyle}>
    <span style={{fontWeight: 300, letterSpacing: '0.01em'}}>
      made with
      <span style={heartStyle} role="img" aria-label="heart">❤️</span>
      for moms
    </span>
    <span style={copyrightStyle}>
      &copy; {new Date().getFullYear()} Recipe Finder
    </span>
    <style>{`
      @keyframes blink-heart {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }
      @media (max-width: 700px) {
        footer {
          font-size: 0.92rem !important;
          padding: 0.4rem 0 0.2rem 0 !important;
        }
        span[role="img"] {
          font-size: 1em !important;
        }
      }
    `}</style>
  </footer>
);

export default Footer;
