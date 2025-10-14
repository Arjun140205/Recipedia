import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiLogIn, FiCoffee, FiHeart } from 'react-icons/fi';
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
      setIsMobile(window.innerWidth <= 768);
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '1rem' : '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '450px',
          width: '100%',
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
          background: 'linear-gradient(45deg, #e67e22, #f39c12)',
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
          background: 'linear-gradient(45deg, #32cd32, #5ed85e)',
          borderRadius: '50%',
          opacity: 0.1,
          filter: 'blur(30px)'
        }} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: isMobile ? '1.5rem' : '2rem' }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <FiCoffee size={32} color="#e67e22" />
            <h1 style={{
              fontSize: isMobile ? '1.75rem' : '2rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              Welcome Back
            </h1>
          </div>
          <p style={{
            color: '#666',
            fontSize: isMobile ? '1rem' : '1.1rem',
            margin: 0,
            lineHeight: '1.5'
          }}>
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
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '500',
              fontSize: '0.95rem'
            }}>
              Username
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
                placeholder="Enter your username"
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
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
                required
                autoComplete="username"
              />
            </div>
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
                placeholder="Enter your password"
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
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
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
                : 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)',
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
              boxShadow: loading ? 'none' : '0 4px 15px rgba(230, 126, 34, 0.3)'
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
            marginTop: '2rem',
            padding: '1.5rem 0',
            borderTop: '1px solid rgba(230, 126, 34, 0.1)'
          }}
        >
          <p style={{
            color: '#666',
            fontSize: '0.95rem',
            margin: '0 0 1rem 0'
          }}>
            Don't have an account yet?
          </p>
          <Link
            to="/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#e67e22',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => {
              e.target.style.color = '#d35400';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={e => {
              e.target.style.color = '#e67e22';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <FiHeart />
            Join as a Creator
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
  );
};

export default Login;
