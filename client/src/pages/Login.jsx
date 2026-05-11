import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiLogIn, FiCoffee, FiHeart, FiBook, FiUsers, FiStar } from 'react-icons/fi';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/auth.css';

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
    <div className="auth-theme-login auth-page-wrapper">
      <div className="auth-grid">

        {/* Left Side - Welcome Panel (Desktop) */}
        {!isMobile && (
          <motion.div
            className="auth-welcome-panel"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="auth-welcome-header">
              <motion.div
                className="auth-welcome-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <FiCoffee size={36} color="white" />
              </motion.div>
              <h2 className="auth-welcome-title">
                Welcome Back,<br />Chef!
              </h2>
              <p className="auth-welcome-subtitle">
                Your kitchen awaits. Sign in to continue exploring recipes and sharing culinary magic.
              </p>
            </div>

            <div className="auth-features-grid">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  className="auth-highlight-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                >
                  <div className="auth-highlight-icon">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="auth-highlight-title">{item.title}</h3>
                    <p className="auth-highlight-desc">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Right Side - Login Form */}
        <motion.div
          className="auth-form-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative accent */}
          <div className="auth-accent-bar" />

          {/* Decorative background blobs */}
          <div className="auth-blob-top" />
          <div className="auth-blob-bottom" />

          {/* Mobile welcome note */}
          {isMobile && (
            <motion.div
              className="auth-mobile-preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="auth-mobile-icons">
                <FiBook size={18} color="#e67e22" />
                <FiUsers size={18} color="#e67e22" />
                <FiStar size={18} color="#e67e22" />
                <FiHeart size={18} color="#e67e22" />
              </div>
              <p className="auth-mobile-text">
                Recipes • Community • Favorites • Share
              </p>
            </motion.div>
          )}

          {/* Header */}
          <motion.div
            className={`auth-card-header ${isMobile ? 'auth-card-header--mobile' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="auth-card-header-row">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FiCoffee size={isMobile ? 24 : 28} color="#e67e22" />
              </motion.div>
              <h1 className="auth-card-title">
                Welcome Back
              </h1>
            </div>
            <p className="auth-card-subtitle">
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
            <div className="auth-field-group">
              <label className="auth-label">
                Username
              </label>
              <div className="auth-input-wrapper">
                <FiUser className="auth-input-icon" />
                <input
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="auth-input-field"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="auth-field-group auth-field-group--last">
              <label className="auth-label">
                Password
              </label>
              <div className="auth-input-wrapper">
                <FiLock className="auth-input-icon" />
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="auth-input-field"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <motion.div
                className="auth-error"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="auth-error-emoji">⚠️</span>
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <div className="auth-spinner" />
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
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="auth-footer-text">
              Don't have an account yet?
            </p>
            <Link to="/signup" className="auth-footer-link">
              <FiHeart />
              Join as a Creator
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
