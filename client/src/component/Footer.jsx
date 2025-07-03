import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiHeart, 
  FiGithub, 
  FiMail, 
  FiLinkedin,
  FiCoffee,
  FiMapPin,
  FiPhone
} from 'react-icons/fi';

const Footer = () => {
  const footerStyle = {
    width: '100%',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: '#ecf0f1',
    position: 'relative',
    marginTop: '4rem',
    overflow: 'hidden',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1rem 1.5rem',
    position: 'relative',
    zIndex: 2,
  };

  const contentGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  };

  const brandSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#e67e22',
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    marginBottom: '0.5rem',
  };

  const descriptionStyle = {
    color: '#bdc3c7',
    lineHeight: '1.6',
    fontSize: '0.95rem',
    maxWidth: '300px',
  };

  const sectionTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#ecf0f1',
    marginBottom: '1rem',
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  };

  const linkListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  };

  const linkStyle = {
    color: '#bdc3c7',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const socialLinksStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  };

  const socialLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#bdc3c7',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const dividerStyle = {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(189, 195, 199, 0.3), transparent)',
    margin: '2rem 0 1.5rem',
  };

  const bottomSectionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    fontSize: '0.9rem',
    color: '#95a5a6',
  };

  const madeWithLoveStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#bdc3c7',
  };

  const backgroundDecorationStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 50%, rgba(230, 126, 34, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(52, 152, 219, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(155, 89, 182, 0.05) 0%, transparent 50%)
    `,
    zIndex: 1,
  };

  const contactInfo = [
    { icon: FiMapPin, text: 'Made with passion worldwide' },
    { icon: FiMail, text: 'hello@recipedia.com' },
    { icon: FiPhone, text: 'Connect with us' },
  ];

  const quickLinks = [
    'About Us',
    'Privacy Policy',
    'Terms of Service',
    'Contact',
    'Help & Support',
  ];

  return (
    <footer style={footerStyle}>
      <div style={backgroundDecorationStyle}></div>
      
      <motion.div 
        style={containerStyle}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div style={contentGridStyle}>
          {/* Brand Section */}
          <div style={brandSectionStyle}>
            <div style={logoStyle}>
              <FiCoffee size={24} />
              Recipedia
            </div>
            <p style={descriptionStyle}>
              Discover amazing recipes, manage your ingredients, and cook with confidence. 
              Making every meal a delightful experience for families everywhere.
            </p>
            <div style={socialLinksStyle}>
              <motion.div
                style={socialLinkStyle}
                whileHover={{ 
                  scale: 1.1,
                  background: 'rgba(230, 126, 34, 0.2)',
                  color: '#e67e22'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FiGithub size={18} />
              </motion.div>
              <motion.div
                style={socialLinkStyle}
                whileHover={{ 
                  scale: 1.1,
                  background: 'rgba(52, 152, 219, 0.2)',
                  color: '#3498db'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FiLinkedin size={18} />
              </motion.div>
              <motion.div
                style={socialLinkStyle}
                whileHover={{ 
                  scale: 1.1,
                  background: 'rgba(231, 76, 60, 0.2)',
                  color: '#e74c3c'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FiMail size={18} />
              </motion.div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={sectionTitleStyle}>Quick Links</h3>
            <div style={linkListStyle}>
              {quickLinks.map((link, index) => (
                <motion.a
                  key={link}
                  style={linkStyle}
                  whileHover={{ 
                    color: '#e67e22',
                    paddingLeft: '0.5rem'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={sectionTitleStyle}>Get In Touch</h3>
            <div style={linkListStyle}>
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: '#bdc3c7',
                    fontSize: '0.9rem',
                  }}
                  whileHover={{ color: '#e67e22' }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon size={16} />
                  {item.text}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div style={dividerStyle}></div>

        <div style={bottomSectionStyle}>
          <motion.div
            style={madeWithLoveStyle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Made with 
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                color: ['#e74c3c', '#c0392b', '#e74c3c']
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FiHeart size={16} />
            </motion.div>
            for moms and food lovers
          </motion.div>
          
          <div style={{ color: '#95a5a6', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Recipedia. All rights reserved.
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
