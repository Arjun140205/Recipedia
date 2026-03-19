import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiLock,
  FiUserPlus,
  FiCoffee,
  FiHeart,
  FiStar,
  FiUsers,
  FiBook,
  FiCamera
} from 'react-icons/fi';
import { signup } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
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
      await signup(form);
      toast.success('Welcome to the creator community! 🎉 Please log in to start sharing your recipes.');
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Signup failed. Please try again.';
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

  const features = [
    {
      icon: FiBook,
      title: 'Share Your Recipes',
      description: 'Upload your favorite recipes with photos and videos'
    },
    {
      icon: FiUsers,
      title: 'Build Your Following',
      description: 'Connect with food lovers who appreciate your cooking'
    },
    {
      icon: FiStar,
      title: 'Get Recognition',
      description: 'Receive likes and feedback from the community'
    },
    {
      icon: FiCamera,
      title: 'Showcase Your Skills',
      description: 'Create beautiful recipe cards and cooking videos'
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Lato:wght@300;400;500;600;700&display=swap');

        .signup-page-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfbf7 0%, #fff8f0 50%, #fdfbf7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .signup-page-wrapper::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(50, 205, 50, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .signup-page-wrapper::after {
          content: '';
          position: absolute;
          bottom: -150px;
          left: -150px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(230, 126, 34, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .signup-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1100px;
          width: 100%;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 1024px) {
          .signup-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            max-width: 480px;
          }
          .signup-page-wrapper {
            padding: 1rem;
          }
        }

        .signup-input-field {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border-radius: 12px;
          border: 2px solid rgba(50, 205, 50, 0.15);
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
        }

        .signup-input-field::placeholder {
          color: #a0aec0;
          font-weight: 400;
        }

        .signup-input-field:focus {
          border-color: #32cd32;
          box-shadow: 0 0 0 4px rgba(50, 205, 50, 0.08);
          background: #fff;
        }

        @media (max-width: 768px) {
          .signup-input-field {
            padding: 0.875rem 0.875rem 0.875rem 2.75rem;
            font-size: 16px;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .signup-input-field {
            font-size: 16px;
          }
        }

        .signup-submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #32cd32 0%, #5ed85e 100%);
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
          box-shadow: 0 4px 15px rgba(50, 205, 50, 0.3);
          position: relative;
          overflow: hidden;
        }

        .signup-submit-btn:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(50, 205, 50, 0.4);
          transform: translateY(-1px);
        }

        .signup-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .signup-submit-btn:disabled {
          background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .signup-submit-btn {
            padding: 0.875rem;
            font-size: 1rem;
          }
        }

        .signup-highlight-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 14px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(50, 205, 50, 0.08);
          transition: all 0.3s ease;
        }

        .signup-highlight-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(50, 205, 50, 0.1);
          border-color: rgba(50, 205, 50, 0.15);
        }

        .signup-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #32cd32;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          font-family: 'Lato', sans-serif;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }

        .signup-link:hover {
          color: #228b22;
          background: rgba(50, 205, 50, 0.06);
          transform: translateY(-1px);
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

      <div className="signup-page-wrapper">
        <div className="signup-grid">

          {/* Left Side — Features Panel (Desktop) */}
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
                    background: 'linear-gradient(135deg, #32cd32 0%, #5ed85e 100%)',
                    borderRadius: '50%',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 32px rgba(50, 205, 50, 0.25)',
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <FiHeart size={36} color="white" />
                </motion.div>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2.8rem',
                  fontWeight: '600',
                  color: '#2c1810',
                  margin: '0 0 0.75rem 0',
                  lineHeight: '1.2'
                }}>
                  Join Our Creator<br />Community
                </h2>
                <p style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '1.15rem',
                  color: '#666',
                  lineHeight: '1.7',
                  margin: 0,
                  fontWeight: '300'
                }}>
                  Share your culinary passion with food lovers around the world
                </p>
              </div>

              <div style={{
                display: 'grid',
                gap: '1rem'
              }}>
                {features.map((item, index) => (
                  <motion.div
                    key={index}
                    className="signup-highlight-card"
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
                      background: 'linear-gradient(135deg, #32cd32 0%, #5ed85e 100%)',
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(50, 205, 50, 0.2)'
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

          {/* Right Side — Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: '480px',
              width: '100%',
              margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: isMobile ? '16px' : '20px',
              padding: isMobile ? '2rem 1.5rem' : '2.5rem',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(50, 205, 50, 0.06)',
              border: '1px solid rgba(50, 205, 50, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative accent bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #32cd32 0%, #5ed85e 50%, #32cd32 100%)',
              borderRadius: '20px 20px 0 0'
            }} />

            {/* Decorative blobs */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(50, 205, 50, 0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(230, 126, 34, 0.06) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }} />

            {/* Mobile features preview */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  padding: '1rem 1.25rem',
                  background: 'linear-gradient(135deg, rgba(50, 205, 50, 0.05) 0%, rgba(94, 216, 94, 0.03) 100%)',
                  borderRadius: '12px',
                  border: '1px solid rgba(50, 205, 50, 0.08)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <FiBook size={18} color="#32cd32" />
                  <FiUsers size={18} color="#32cd32" />
                  <FiStar size={18} color="#32cd32" />
                  <FiCamera size={18} color="#32cd32" />
                </div>
                <p style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '0.85rem',
                  color: '#888',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Share recipes • Build following • Get recognition • Showcase skills
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
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <FiHeart size={28} color="#32cd32" />
                </motion.div>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: isMobile ? '2rem' : '2.25rem',
                  fontWeight: '600',
                  color: '#2c1810',
                  margin: 0,
                  lineHeight: 1.1
                }}>
                  Become a Creator
                </h1>
              </div>
              <p style={{
                fontFamily: "'Lato', sans-serif",
                color: '#888',
                fontSize: isMobile ? '0.95rem' : '1rem',
                margin: 0,
                lineHeight: '1.5',
                fontWeight: '400'
              }}>
                Start sharing your delicious recipes today
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
                  Creator Username
                </label>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8bc48b',
                    zIndex: 1
                  }} />
                  <input
                    name="username"
                    type="text"
                    placeholder="Choose your creator name"
                    value={form.username}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="signup-input-field"
                    required
                    autoComplete="username"
                  />
                </div>
                <p style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '0.8rem',
                  color: '#aaa',
                  margin: '0.4rem 0 0 0',
                  fontWeight: '400'
                }}>
                  This will be your public creator name
                </p>
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
                    color: '#8bc48b',
                    zIndex: 1
                  }} />
                  <input
                    name="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={form.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="signup-input-field"
                    required
                    autoComplete="new-password"
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
                className="signup-submit-btn"
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FiUserPlus />
                    Join as Creator
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
                borderTop: '1px solid rgba(50, 205, 50, 0.1)'
              }}
            >
              <p style={{
                fontFamily: "'Lato', sans-serif",
                color: '#999',
                fontSize: '0.9rem',
                margin: '0 0 0.75rem 0',
                fontWeight: '400'
              }}>
                Already have an account?
              </p>
              <Link to="/login" className="signup-link">
                <FiCoffee />
                Sign In to Cook
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Signup;
