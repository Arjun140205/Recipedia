import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Navbar = () => {
  // eslint-disable-next-line
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    toast.info('Successfully logged out! 👋');
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#e67e22',
          textDecoration: 'none',
          transition: 'transform 0.2s ease',
          display: 'inline-block'
        }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
          Recipe Finder
        </Link>

        <div style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            color: '#333',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s ease',
            position: 'relative'
          }} onMouseOver={e => e.currentTarget.style.color = '#e67e22'}
            onMouseOut={e => e.currentTarget.style.color = '#333'}>
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={{
                color: '#333',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }} onMouseOver={e => e.currentTarget.style.color = '#e67e22'}
                onMouseOut={e => e.currentTarget.style.color = '#333'}>
                My Recipes
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#c0392b';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = '#e74c3c';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: '#333',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }} onMouseOver={e => e.currentTarget.style.color = '#e67e22'}
                onMouseOut={e => e.currentTarget.style.color = '#333'}>
                Login
              </Link>
              <Link to="/signup" style={{
                backgroundColor: '#e67e22',
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }} onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#d35400';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = '#e67e22';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
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
