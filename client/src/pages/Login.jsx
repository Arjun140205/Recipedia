import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiLogIn, FiCoffee, FiHeart, FiBook, FiUsers, FiStar } from 'react-icons/fi';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      // Dispatch a storage event to update navbar state
      window.dispatchEvent(new Event('storage'));
      toast.success('Welcome back! Ready to cook? 👨‍🍳');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const highlights = [
    {
      icon: FiBook,
      title: 'Your Recipe Collection',
      description: 'Access all your saved and created recipes in one place'
    },
    {
      icon: FiUsers,
      title: 'Creator Community',
      description: 'Connect with passionate home cooks worldwide'
    },
    {
      icon: FiStar,
      title: 'Personalized Experience',
      description: 'Get recommendations tailored to your taste'
    },
    {
      icon: FiHeart,
      title: 'Save & Share',
      description: 'Bookmark favorites and share your culinary creations'
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Lato:wght@300;400;500;600;700&display=swap');

        .login-page-wrapper *,
        .login-page-wrapper *::before,
        .login-page-wrapper *::after {
          box-sizing: border-box;
        }

        .login-page-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfbf7 0%, #fff8f0 50%, #fdfbf7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
          width: 100%;
        }

        .login-page-wrapper::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(230, 126, 34, 0.06) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .login-page-wrapper::after {
          content: '';
          position: absolute;
          bottom: -150px;
          left: -150px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(243, 156, 18, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .login-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1100px;
          width: 100%;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .login-form-card {
          max-width: 480px;
          width: 100%;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(230, 126, 34, 0.06);
          border: 1px solid rgba(230, 126, 34, 0.1);
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 1024px) {
          .login-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            max-width: 100%;
          }
          .login-page-wrapper {
            padding: 1rem;
          }
          .login-form-card {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .login-page-wrapper {
            padding: 0.75rem;
            align-items: flex-start;
            padding-top: 1.5rem;
          }
          .login-form-card {
            border-radius: 16px;
            padding: 1.75rem 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .login-page-wrapper {
            padding: 0.5rem;
            padding-top: 1rem;
          }
          .login-form-card {
            border-radius: 14px;
            padding: 1.5rem 1rem;
          }
        }

        @media (max-width: 380px) {
          .login-form-card {
            padding: 1.25rem 0.875rem;
            border-radius: 12px;
          }
        }

        .login-input-field {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border-radius: 12px;
          border: 2px solid rgba(230, 126, 34, 0.15);
          font-size: 1rem;
          font-family: 'Lato', sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.9);
          outline: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          color: #2D3748;
          box-sizing: border-box;
          max-width: 100%;
        }

        .login-input-field::placeholder {
          color: #a0aec0;
          font-weight: 400;
        }

        .login-input-field:focus {
          border-color: #e67e22;
          box-shadow: 0 0 0 4px rgba(230, 126, 34, 0.08);
          background: #fff;
        }

        @media (max-width: 768px) {
          .login-input-field {
            padding: 0.875rem 0.875rem 0.875rem 2.75rem;
            font-size: 16px;
            border-radius: 10px;
          }
        }

        @media (max-width: 480px) {
          .login-input-field {
            padding: 0.8rem 0.75rem 0.8rem 2.5rem;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .login-input-field {
            font-size: 16px;
          }
        }

        .login-submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          font-family: 'Lato', sans-serif;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .login-submit-btn:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(230, 126, 34, 0.4);
          transform: translateY(-1px);
        }

        .login-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-submit-btn:disabled {
          background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .login-submit-btn {
            padding: 0.875rem;
            font-size: 1rem;
            border-radius: 10px;
          }
        }

        .highlight-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 14px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(230, 126, 34, 0.08);
          transition: all 0.3s ease;
        }

        .highlight-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(230, 126, 34, 0.1);
          border-color: rgba(230, 126, 34, 0.15);
        }

        .login-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #e67e22;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          font-family: 'Lato', sans-serif;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }

        .login-link:hover {
          color: #d35400;
          background: rgba(230, 126, 34, 0.06);
          transform: translateY(-1px);
        }

        .login-header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.25rem;
          font-weight: 600;
          color: #2c1810;
          margin: 0;
          line-height: 1.1;
        }

        .login-header-subtitle {
          font-family: 'Lato', sans-serif;
          color: #888;
          font-size: 1rem;
          margin: 0;
          line-height: 1.5;
          font-weight: 400;
        }

        @media (max-width: 480px) {
          .login-header-title {
            font-size: 1.75rem;
          }
          .login-header-subtitle {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 380px) {
          .login-header-title {
            font-size: 1.5rem;
          }
          .login-header-subtitle {
            font-size: 0.85rem;
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      <div className="login-page-wrapper">
        <div className="login-grid">

          {/* Left Side - Welcome Panel (Desktop) */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ padding: '1rem' }}
            >
              <div style={{
                textAlign: 'center',
                marginBottom: '2.5rem'
              }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)',
                    borderRadius: '50%',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 32px rgba(230, 126, 34, 0.3)',
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <FiCoffee size={36} color="white" />
                </motion.div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2.8rem',
                  fontWeight: '600',
                  color: '#2c1810',
                  margin: '0 0 0.75rem 0',
                  lineHeight: '1.2'
                }}>
                  Welcome Back,<br />Chef!
                </h2>
                <p style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '1.15rem',
                  color: '#666',
                  lineHeight: '1.7',
                  margin: 0,
                  fontWeight: '300'
                }}>
                  Your kitchen awaits. Sign in to continue exploring recipes and sharing culinary magic.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gap: '1rem'
              }}>
                {highlights.map((item, index) => (
                  <motion.div
                    key={index}
                    className="highlight-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '46px',
                      height: '46px',
                      minWidth: '46px',
                      background: 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)',
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(230, 126, 34, 0.2)'
                    }}>
                      <item.icon size={22} />
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: "'Lato', sans-serif",
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#2c1810',
                        margin: '0 0 0.2rem 0'
                      }}>
                        {item.title}
                      </h3>
                      <p style={{
                        fontFamily: "'Lato', sans-serif",
                        fontSize: '0.85rem',
                        color: '#888',
                        margin: 0,
                        lineHeight: '1.4',
                        fontWeight: '400'
                      }}>
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Right Side - Login Form */}
          <motion.div
            className="login-form-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #e67e22 0%, #f39c12 50%, #e67e22 100%)',
              borderRadius: '20px 20px 0 0'
            }} />

            {/* Decorative background blobs */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(230, 126, 34, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(243, 156, 18, 0.06) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            {/* Mobile welcome note */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  padding: '1rem 1.25rem',
                  background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.05) 0%, rgba(243, 156, 18, 0.03) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(230, 126, 34, 0.08)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <FiBook size={18} color="#e67e22" />
                  <FiUsers size={18} color="#e67e22" />
                  <FiStar size={18} color="#e67e22" />
                  <FiHeart size={18} color="#e67e22" />
                </div>
                <p style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '0.85rem',
                  color: '#888',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Recipes • Community • Favorites • Share
                </p>
              </motion.div>
            )}

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: isMobile ? '1.75rem' : '2rem' }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem'
              }}>
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <FiCoffee size={isMobile ? 24 : 28} color="#e67e22" />
                </motion.div>
                <h1 className="login-header-title">
                  Welcome Back
                </h1>
              </div>
              <p className="login-header-subtitle">
                Sign in to continue your culinary journey
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              onSubmit={handleSubmit}
            >
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#2c1810',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  fontFamily: "'Lato', sans-serif",
                  letterSpacing: '0.01em'
                }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#c0a080',
                    zIndex: 1
                  }} />
                  <input
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="login-input-field"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#2c1810',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  fontFamily: "'Lato', sans-serif",
                  letterSpacing: '0.01em'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#c0a080',
                    zIndex: 1
                  }} />
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="login-input-field"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    color: '#c0392b',
                    marginBottom: '1.25rem',
                    padding: '0.875rem 1rem',
                    backgroundColor: 'rgba(231, 76, 60, 0.08)',
                    borderRadius: '10px',
                    border: '1px solid rgba(231, 76, 60, 0.15)',
                    fontSize: '0.9rem',
                    fontFamily: "'Lato', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Signing in...
                  </>
                ) : (
                  <>
                    <FiLogIn />
                    Sign In
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{
                textAlign: 'center',
                marginTop: '1.75rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(230, 126, 34, 0.1)'
              }}
            >
              <p style={{
                fontFamily: "'Lato', sans-serif",
                color: '#999',
                fontSize: '0.9rem',
                margin: '0 0 0.75rem 0',
                fontWeight: '400'
              }}>
                Don't have an account yet?
              </p>
              <Link to="/signup" className="login-link">
                <FiHeart />
                Join as a Creator
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
