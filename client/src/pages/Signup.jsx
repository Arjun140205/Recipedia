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
import '../styles/auth.css';

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
    <div className="auth-theme-signup auth-page-wrapper">
      <div className="auth-grid">

        {/* Left Side — Features Panel (Desktop) */}
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
                <FiHeart size={36} color="white" />
              </motion.div>
              <h2 className="auth-welcome-title">
                Join Our Creator<br />Community
              </h2>
              <p className="auth-welcome-subtitle">
                Share your culinary passion with food lovers around the world
              </p>
            </div>

            <div className="auth-features-grid">
              {features.map((item, index) => (
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

        {/* Right Side — Signup Form */}
        <motion.div
          className="auth-form-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative accent bar */}
          <div className="auth-accent-bar" />

          {/* Decorative blobs */}
          <div className="auth-blob-top" />
          <div className="auth-blob-bottom" />

          {/* Mobile features preview */}
          {isMobile && (
            <motion.div
              className="auth-mobile-preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="auth-mobile-icons">
                <FiBook size={18} color="#32cd32" />
                <FiUsers size={18} color="#32cd32" />
                <FiStar size={18} color="#32cd32" />
                <FiCamera size={18} color="#32cd32" />
              </div>
              <p className="auth-mobile-text">
                Share recipes • Build following • Get recognition • Showcase skills
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
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FiHeart size={isMobile ? 24 : 28} color="#32cd32" />
              </motion.div>
              <h1 className="auth-card-title">
                Become a Creator
              </h1>
            </div>
            <p className="auth-card-subtitle">
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
            <div className="auth-field-group">
              <label className="auth-label">
                Creator Username
              </label>
              <div className="auth-input-wrapper">
                <FiUser className="auth-input-icon" />
                <input
                  name="username"
                  type="text"
                  placeholder="Choose your creator name"
                  value={form.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="auth-input-field"
                  required
                  autoComplete="username"
                />
              </div>
              <p className="auth-field-hint">
                This will be your public creator name
              </p>
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
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="auth-input-field"
                  required
                  autoComplete="new-password"
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
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="auth-footer-text">
              Already have an account?
            </p>
            <Link to="/login" className="auth-footer-link">
              <FiCoffee />
              Sign In to Cook
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
