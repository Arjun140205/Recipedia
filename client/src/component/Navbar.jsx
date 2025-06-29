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
    background: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    borderBottom: '1px solid #f0f0f0',
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
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1a1a1a',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  };

  const navLinkStyle = {
    position: 'relative',
    fontWeight: '500',
    textDecoration: 'none',
    color: '#4a4a4a',
    padding: '0.5rem',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease',
  };

  const buttonBase = {
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1.2rem',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background-color 0.2s ease',
  };

  const hoverIn = (e) => {
    e.currentTarget.style.color = '#e67e22';
  };

  const hoverOut = (e) => {
    e.currentTarget.style.color = '#4a4a4a';
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
          onMouseOver={(e) => (e.currentTarget.style.color = '#f39c12')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#e67e22')}
        >
          Recipedia
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

          <Link
            to="/recipes"
            style={navLinkStyle}
            onMouseOver={hoverIn}
            onMouseOut={hoverOut}
          >
            Recipes
          </Link>

          <Link
            to="/fridge-mate"
            style={navLinkStyle}
            onMouseOver={hoverIn}
            onMouseOut={hoverOut}
          >
            Fridge Mate
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
                  backgroundColor: '#ff4757',
                  color: '#fff',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff6b81'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff4757'}
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
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f39c12'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e67e22'}
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
