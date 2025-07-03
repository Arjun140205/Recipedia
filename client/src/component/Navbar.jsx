import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiBook, 
  FiShoppingCart, 
  FiUser, 
  FiLogOut, 
  FiLogIn, 
  FiUserPlus,
  FiMenu,
  FiX,
  FiCoffee
} from 'react-icons/fi';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    toast.info('Successfully logged out! 👋');
    navigate('/');
    setMenuOpen(false);
  };

  const isActivePath = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/about')) {
      return true;
    }
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/recipes', label: 'Recipes', icon: FiBook },
    { path: '/fridge-mate', label: 'Fridge Mate', icon: FiShoppingCart },
  ];

  if (isAuthenticated) {
    navItems.push({ path: '/dashboard', label: 'My Recipes', icon: FiUser });
  }

  const navStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: isScrolled ? '0.75rem 1rem' : '1rem',
    background: isScrolled 
      ? 'rgba(255, 255, 255, 0.95)' 
      : 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: isScrolled 
      ? '0 4px 20px rgba(0,0,0,0.08)' 
      : '0 2px 10px rgba(0,0,0,0.04)',
    borderBottom: `1px solid ${isScrolled ? '#e0e0e0' : '#f5f5f5'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#2c3e50',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    transition: 'all 0.3s ease',
  };

  const navLinkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: isActive ? '600' : '500',
    textDecoration: 'none',
    color: isActive ? '#e67e22' : '#5a6c7d',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    background: isActive ? 'rgba(230, 126, 34, 0.08)' : 'transparent',
    border: isActive ? '1px solid rgba(230, 126, 34, 0.2)' : '1px solid transparent',
  });

  const buttonStyle = (variant = 'primary') => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: '12px',
    padding: '0.75rem 1.25rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: variant === 'primary' 
      ? 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)' 
      : variant === 'danger'
      ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
      : 'transparent',
    color: variant === 'ghost' ? '#5a6c7d' : '#fff',
    border: variant === 'ghost' ? '1px solid #e0e6ed' : 'none',
    boxShadow: variant !== 'ghost' ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
  });

  const mobileMenuStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    zIndex: 999,
  };

  const desktopMenuStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  return (
    <>
      <motion.nav 
        style={navStyles}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div style={containerStyle}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              style={logoStyle}
              onMouseOver={(e) => (e.currentTarget.style.color = '#e67e22')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#2c3e50')}
            >
              <FiCoffee size={24} />
              Recipedia
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <motion.button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5a6c7d',
                fontSize: '1.5rem',
                zIndex: 1001,
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </motion.button>
          )}

          {/* Desktop Menu */}
          {!isMobile && (
            <div style={desktopMenuStyle}>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    to={item.path}
                    style={navLinkStyle(isActivePath(item.path))}
                    onMouseOver={(e) => {
                      if (!isActivePath(item.path)) {
                        e.currentTarget.style.background = 'rgba(230, 126, 34, 0.05)';
                        e.currentTarget.style.color = '#e67e22';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActivePath(item.path)) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#5a6c7d';
                      }
                    }}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Auth Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                {isAuthenticated ? (
                  <motion.button
                    style={buttonStyle('danger')}
                    onClick={handleLogout}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 6px 20px rgba(231, 76, 60, 0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
                    }}
                  >
                    <FiLogOut size={16} />
                    Logout
                  </motion.button>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/login"
                        style={buttonStyle('ghost')}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(90, 108, 125, 0.05)';
                          e.currentTarget.style.color = '#2c3e50';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#5a6c7d';
                        }}
                      >
                        <FiLogIn size={16} />
                        Login
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 6px 20px rgba(230, 126, 34, 0.3)'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/signup"
                        style={buttonStyle('primary')}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)';
                        }}
                      >
                        <FiUserPlus size={16} />
                        Sign Up
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            style={mobileMenuStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                paddingTop: '4rem',
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Link
                    to={item.path}
                    style={{
                      ...navLinkStyle(isActivePath(item.path)),
                      fontSize: '1.2rem',
                      padding: '1rem 2rem',
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  alignItems: 'center',
                  marginTop: '2rem',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {isAuthenticated ? (
                  <button
                    style={{
                      ...buttonStyle('danger'),
                      fontSize: '1.1rem',
                      padding: '1rem 2rem',
                    }}
                    onClick={handleLogout}
                  >
                    <FiLogOut size={18} />
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      style={{
                        ...buttonStyle('ghost'),
                        fontSize: '1.1rem',
                        padding: '1rem 2rem',
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiLogIn size={18} />
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      style={{
                        ...buttonStyle('primary'),
                        fontSize: '1.1rem',
                        padding: '1rem 2rem',
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiUserPlus size={18} />
                      Sign Up
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div style={{ height: isScrolled ? '70px' : '80px' }} />
    </>
  );
};

export default Navbar;
