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
  FiUserPlus,
  FiMenu,
  FiX
} from 'react-icons/fi';

// Custom Noodle Bowl SVG Logo Component
const NoodleBowlLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bowl */}
    <motion.path
      d="M20 45 Q20 75, 50 80 Q80 75, 80 45 L75 45 Q75 68, 50 72 Q25 68, 25 45 Z"
      fill="#e67e22"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    {/* Bowl rim */}
    <ellipse cx="50" cy="45" rx="30" ry="8" fill="#f39c12" />
    
    {/* Noodles - wavy lines */}
    <motion.path
      d="M35 50 Q40 45, 45 50 T55 50"
      stroke="#FFF4E6"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      animate={{ d: ["M35 50 Q40 45, 45 50 T55 50", "M35 50 Q40 52, 45 50 T55 50", "M35 50 Q40 45, 45 50 T55 50"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path
      d="M30 55 Q38 52, 46 55 T62 55"
      stroke="#FFF4E6"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      animate={{ d: ["M30 55 Q38 52, 46 55 T62 55", "M30 55 Q38 58, 46 55 T62 55", "M30 55 Q38 52, 46 55 T62 55"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />
    
    {/* Chopsticks */}
    <motion.line
      x1="65" y1="35" x2="75" y2="20"
      stroke="#8B4513"
      strokeWidth="2.5"
      strokeLinecap="round"
      animate={{ rotate: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "65px 35px" }}
    />
    <motion.line
      x1="70" y1="35" x2="82" y2="18"
      stroke="#8B4513"
      strokeWidth="2.5"
      strokeLinecap="round"
      animate={{ rotate: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      style={{ transformOrigin: "70px 35px" }}
    />
    
    {/* Steam */}
    <motion.path
      d="M40 35 Q42 28, 40 22"
      stroke="#FFB4A2"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
      animate={{ opacity: [0.3, 0.7, 0.3], y: [-2, 0, -2] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path
      d="M50 35 Q52 28, 50 20"
      stroke="#FFB4A2"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
      animate={{ opacity: [0.4, 0.8, 0.4], y: [-2, 0, -2] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
    />
    <motion.path
      d="M60 35 Q58 28, 60 22"
      stroke="#FFB4A2"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
      animate={{ opacity: [0.3, 0.7, 0.3], y: [-2, 0, -2] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
    />
  </svg>
);

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
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
    { path: '/creators', label: 'Creators', icon: FiUser },
  ];

  if (isAuthenticated) {
    navItems.push({ path: '/dashboard', label: 'My Recipes', icon: FiBook });
  }

  const navStyles = {
    position: 'fixed',
    top: isMobile ? '1rem' : '2rem',
    left: isMobile ? '1rem' : '3rem',
    right: isMobile ? '1rem' : '3rem',
    zIndex: 1000,
    padding: 0,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr auto' : 'auto 1fr auto',
    alignItems: 'center',
    gap: isMobile ? '1rem' : '2rem',
    padding: isMobile ? '1rem 1.5rem' : '0.75rem 1.5rem',
    background: '#FFFBF5',
    borderRadius: '50px',
    boxShadow: '0 8px 32px rgba(230, 126, 34, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
    border: '2px solid rgba(243, 156, 18, 0.2)',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  };

  const logoTextStyle = {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
  };

  const navLinkStyle = (isActive) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: isActive ? '700' : '500',
    textDecoration: 'none',
    color: isActive ? '#e67e22' : '#2D3748',
    padding: '0.5rem 0.875rem',
    fontSize: '0.875rem',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    letterSpacing: '-0.01em',
    borderRadius: '20px',
  });

  const buttonStyle = (variant = 'primary') => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: '25px',
    padding: '0.5rem 1.25rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
    textDecoration: 'none',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    background: variant === 'primary' 
      ? 'linear-gradient(45deg, #e67e22, #f39c12)' 
      : variant === 'danger'
      ? '#E53E3E'
      : 'transparent',
    color: variant === 'ghost' ? '#2D3748' : '#fff',
    border: variant === 'ghost' ? '2px solid #E2E8F0' : 'none',
    boxShadow: variant !== 'ghost' ? '0 4px 12px rgba(230, 126, 34, 0.25)' : 'none',
    letterSpacing: '-0.01em',
  });

  const mobileMenuStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: '#FFFBF5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    zIndex: 999,
    padding: '2rem',
  };

  const desktopMenuStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
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
          <Link to="/" style={logoStyle}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <NoodleBowlLogo size={isMobile ? 36 : 36} />
            </motion.div>
            <div style={logoTextStyle}>
              <motion.span
                style={{
                  fontSize: isMobile ? '1.5rem' : '1.375rem',
                  fontWeight: '800',
                  color: '#2D3748',
                  letterSpacing: '-0.03em',
                  fontFamily: "'Inter', -apple-system, sans-serif",
                }}
                whileHover={{ color: '#e67e22' }}
              >
                Recipedia
              </motion.span>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: '500',
                  color: '#f39c12',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginTop: '-0.125rem',
                }}
              >
                Kitchen Stories
              </span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          {isMobile && (
            <motion.button
              style={{
                background: 'linear-gradient(45deg, #e67e22, #f39c12)',
                border: 'none',
                cursor: 'pointer',
                padding: '0.75rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.25rem',
                zIndex: 1001,
                boxShadow: '0 4px 12px rgba(230, 126, 34, 0.3)',
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </motion.button>
          )}

          {/* Desktop Menu */}
          {!isMobile && (
            <div style={desktopMenuStyle}>
              {navItems.map((item, index) => {
                const isActive = isActivePath(item.path);
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={item.path}
                      style={navLinkStyle(isActive)}
                      onMouseOver={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(230, 126, 34, 0.08)';
                          e.currentTarget.style.color = '#e67e22';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#2D3748';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: 'absolute',
                          bottom: '-8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#e67e22',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.div>
                );
              })}

              {/* Auth Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {isAuthenticated ? (
                  <motion.button
                    style={buttonStyle('danger')}
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(229, 62, 62, 0.35)' }}
                    whileTap={{ scale: 0.95 }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#C53030';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#E53E3E';
                    }}
                  >
                    <FiLogOut size={16} />
                    Logout
                  </motion.button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      style={buttonStyle('ghost')}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(230, 126, 34, 0.08)';
                        e.currentTarget.style.borderColor = '#e67e22';
                        e.currentTarget.style.color = '#e67e22';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.color = '#2D3748';
                      }}
                    >
                      Login
                    </Link>
                    <motion.div
                      whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(230, 126, 34, 0.35)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/signup"
                        style={buttonStyle('primary')}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #d35400, #e67e22)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #e67e22, #f39c12)';
                        }}
                      >
                        <FiUserPlus size={16} />
                        Get Started
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
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 + 0.15 }}
                >
                  <Link
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '1.5rem',
                      fontWeight: isActivePath(item.path) ? '700' : '500',
                      color: isActivePath(item.path) ? '#e67e22' : '#2D3748',
                      textDecoration: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '20px',
                      background: isActivePath(item.path) ? 'rgba(230, 126, 34, 0.1)' : 'transparent',
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <item.icon size={24} />
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
                  <motion.button
                    style={{
                      ...buttonStyle('danger'),
                      fontSize: '1.125rem',
                      padding: '1rem 2.5rem',
                    }}
                    onClick={handleLogout}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLogOut size={20} />
                    Logout
                  </motion.button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      style={{
                        ...buttonStyle('ghost'),
                        fontSize: '1.125rem',
                        padding: '1rem 2.5rem',
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/signup"
                        style={{
                          ...buttonStyle('primary'),
                          fontSize: '1.125rem',
                          padding: '1rem 2.5rem',
                        }}
                        onClick={() => setMenuOpen(false)}
                      >
                        <FiUserPlus size={20} />
                        Get Started
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div style={{ height: isMobile ? '80px' : '85px' }} />
    </>
  );
};

export default Navbar;
