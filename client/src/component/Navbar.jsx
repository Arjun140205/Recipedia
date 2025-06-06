import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    toast.info('Successfully logged out! 👋');
    navigate('/');
  };

  const navStyles = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '1rem',
    backdropFilter: 'blur(10px)',
    background: 'rgba(255, 255, 255, 0.75)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const logoStyle = {
    fontSize: '1.7rem',
    fontWeight: 'bold',
    color: '#e67e22',
    textDecoration: 'none',
    transition: 'transform 0.3s ease',
  };

  const navLinkStyle = {
    position: 'relative',
    fontWeight: 500,
    textDecoration: 'none',
    color: '#333',
    padding: '0.5rem',
    transition: 'all 0.3s ease',
    display: 'inline-block',
  };

  const buttonBase = {
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  };

  const hoverIn = (e) => {
    e.currentTarget.style.color = '#e67e22';
    e.currentTarget.style.transform = 'scale(1.05)';
    underlineEffect(e, true);
  };

  const hoverOut = (e) => {
    e.currentTarget.style.color = '#333';
    e.currentTarget.style.transform = 'scale(1)';
    underlineEffect(e, false);
  };

  const underlineEffect = (e, show) => {
    let bar = e.currentTarget.querySelector('.underline-bar');
    if (!bar && show) {
      bar = document.createElement('span');
      bar.className = 'underline-bar';
      Object.assign(bar.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '2px',
        backgroundColor: '#e67e22',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.3s ease',
        display: 'block',
      });
      e.currentTarget.appendChild(bar);
      requestAnimationFrame(() => {
        bar.style.transform = 'scaleX(1)';
      });
    } else if (bar && !show) {
      bar.style.transform = 'scaleX(0)';
      setTimeout(() => bar.remove(), 300);
    }
  };

  const liquidHover = (e) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.1)';
  };

  const liquidOut = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  const menuIconStyle = {
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    background: 'white',
    fontSize: '1.25rem',
    display: isMobile ? 'block' : 'none',
  };

  const menuStyle = {
    display: isMobile ? (menuOpen ? 'flex' : 'none') : 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '1rem' : '2rem',
    alignItems: isMobile ? 'flex-start' : 'center',
    paddingTop: isMobile ? '1rem' : '0',
    transition: 'all 0.3s ease',
  };

  return (
    <nav style={navStyles}>
      <div style={containerStyle}>
        <Link
          to="/"
          style={logoStyle}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Recipe Finder
        </Link>

        <div
          style={menuIconStyle}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </div>

        <div style={menuStyle}>
          <Link
            to="/"
            style={navLinkStyle}
            onMouseOver={hoverIn}
            onMouseOut={hoverOut}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                style={navLinkStyle}
                onMouseOver={hoverIn}
                onMouseOut={hoverOut}
              >
                My Recipes
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  ...buttonBase,
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                }}
                onMouseOver={liquidHover}
                onMouseOut={liquidOut}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={navLinkStyle}
                onMouseOver={hoverIn}
                onMouseOut={hoverOut}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  ...buttonBase,
                  backgroundColor: '#e67e22',
                  color: '#fff',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
                onMouseOver={liquidHover}
                onMouseOut={liquidOut}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
