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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.1) 0%, rgba(50, 205, 50, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '1rem' : '2rem'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '2rem' : '3rem',
        maxWidth: '1200px',
        width: '100%',
        alignItems: 'center'
      }}>
        {/* Left Side - Features */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ padding: '2rem' }}
          >
            <div style={{
              textAlign: 'center',
              marginBottom: '3rem'
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
                  marginBottom: '1rem',
                  boxShadow: '0 8px 32px rgba(230, 126, 34, 0.3)'
                }}
              >
                <FiCoffee size={36} color="white" />
              </motion.div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #e67e22 0%, #32cd32 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: '0 0 1rem 0'
              }}>
                Join Our Creator Community
              </h2>
              <p style={{
                fontSize: '1.2rem',
                color: '#666',
                lineHeight: '1.6',
                margin: 0
              }}>
                Share your culinary passion with food lovers around the world
              </p>
            </div>

            <div style={{
              display: 'grid',
              gap: '1.5rem'
            }}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(230, 126, 34, 0.1)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)',
                    borderRadius: '12px',
                    color: 'white'
                  }}>
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#333',
                      margin: '0 0 0.25rem 0'
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#666',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Right Side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: '450px',
            width: '100%',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: isMobile ? '16px' : '20px',
            padding: isMobile ? '2rem 1.5rem' : '3rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(45deg, #32cd32, #5ed85e)',
            borderRadius: '50%',
            opacity: 0.1,
            filter: 'blur(40px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(45deg, #e67e22, #f39c12)',
            borderRadius: '50%',
            opacity: 0.1,
            filter: 'blur(30px)'
          }} />

          {/* Mobile-only features preview */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{
                textAlign: 'center',
                marginBottom: '2rem',
                padding: '1.5rem',
                background: 'rgba(50, 205, 50, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(50, 205, 50, 0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <FiBook size={20} color="#32cd32" />
                <FiUsers size={20} color="#32cd32" />
                <FiStar size={20} color="#32cd32" />
                <FiCamera size={20} color="#32cd32" />
              </div>
              <p style={{
                fontSize: '0.9rem',
                color: '#666',
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
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <FiHeart size={32} color="#32cd32" />
              <h1 style={{
                fontSize: isMobile ? '1.75rem' : '2rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #32cd32 0%, #e67e22 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0
              }}>
                Become a Creator
              </h1>
            </div>
            <p style={{
              color: '#666',
              fontSize: isMobile ? '1rem' : '1.1rem',
              margin: 0,
              lineHeight: '1.5'
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
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#333',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Creator Username
              </label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  zIndex: 1
                }} />
                <input
                  name="username"
                  type="text"
                  placeholder="Choose your creator name"
                  value={form.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: '100%',
                    padding: isMobile ? '0.875rem 0.875rem 0.875rem 2.75rem' : '1rem 1rem 1rem 3rem',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    fontSize: isMobile ? '16px' : '1rem', // 16px prevents zoom on iOS
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.8)',
                    outline: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#32cd32';
                    e.target.style.boxShadow = '0 0 0 3px rgba(50, 205, 50, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                  autoComplete="username"
                />
              </div>
              <p style={{
                fontSize: '0.8rem',
                color: '#999',
                margin: '0.5rem 0 0 0'
              }}>
                This will be your public creator name
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#333',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  zIndex: 1
                }} />
                <input
                  name="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: '100%',
                    padding: isMobile ? '0.875rem 0.875rem 0.875rem 2.75rem' : '1rem 1rem 1rem 3rem',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    fontSize: isMobile ? '16px' : '1rem', // 16px prevents zoom on iOS
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.8)',
                    outline: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#32cd32';
                    e.target.style.boxShadow = '0 0 0 3px rgba(50, 205, 50, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
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
                  color: '#e74c3c',
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: 'rgba(231, 76, 60, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(231, 76, 60, 0.2)',
                  fontSize: '0.9rem'
                }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{
                width: '100%',
                padding: isMobile ? '0.875rem' : '1rem',
                background: loading 
                  ? 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)'
                  : 'linear-gradient(135deg, #32cd32 0%, #5ed85e 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(50, 205, 50, 0.3)'
              }}
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
              marginTop: '2rem',
              padding: '1.5rem 0',
              borderTop: '1px solid rgba(50, 205, 50, 0.1)'
            }}
          >
            <p style={{
              color: '#666',
              fontSize: '0.95rem',
              margin: '0 0 1rem 0'
            }}>
              Already have an account?
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#32cd32',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => {
                e.target.style.color = '#228b22';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={e => {
                e.target.style.color = '#32cd32';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FiCoffee />
              Sign In to Cook
            </Link>
          </motion.div>

          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
