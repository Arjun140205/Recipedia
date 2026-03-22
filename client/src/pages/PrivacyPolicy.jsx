import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiEye, FiDatabase, FiTrash2, FiMail } from 'react-icons/fi';

const PrivacyPolicy = () => {
    const sections = [
        {
            icon: FiDatabase,
            title: 'Information We Collect',
            content: [
                'Account information (username, email) when you sign up as a creator.',
                'Recipe data, images, and content you upload to the platform.',
                'Usage data such as pages visited, features used, and time spent on the platform.',
                'Device information including browser type, operating system, and screen resolution for optimizing your experience.'
            ]
        },
        {
            icon: FiEye,
            title: 'How We Use Your Information',
            content: [
                'To provide, maintain, and improve the Recipedia platform and services.',
                'To personalize your experience, including recipe recommendations.',
                'To communicate with you about updates, features, and community highlights.',
                'To ensure the security and integrity of our platform.',
                'To analyze usage trends and improve our services for all users.'
            ]
        },
        {
            icon: FiLock,
            title: 'Data Protection',
            content: [
                'Your data is encrypted in transit using industry-standard TLS/SSL protocols.',
                'We implement access controls and authentication measures to protect your account.',
                'We do not sell, rent, or trade your personal information to third parties.',
                'Passwords are securely hashed and never stored in plain text.',
                'Regular security reviews are conducted to protect against vulnerabilities.'
            ]
        },
        {
            icon: FiTrash2,
            title: 'Your Rights & Data Control',
            content: [
                'You can access and update your personal information at any time through your dashboard.',
                'You may request deletion of your account and associated data by contacting us.',
                'You can opt out of promotional communications while still receiving essential service updates.',
                'You have the right to export your recipe data and content at any time.',
                'We retain your data only as long as necessary to provide our services.'
            ]
        }
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Lato:wght@300;400;500;600;700&display=swap');

        .privacy-page *, .privacy-page *::before, .privacy-page *::after { box-sizing: border-box; }

        .privacy-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfbf7 0%, #fff8f0 50%, #fdfbf7 100%);
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }

        .privacy-page::before {
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

        .privacy-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem 2rem 5rem;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) { .privacy-container { padding: 2rem 1rem 4rem; } }
        @media (max-width: 480px) { .privacy-container { padding: 1.5rem 0.75rem 3rem; } }
      `}</style>

            <div className="privacy-page">
                <div className="privacy-container">

                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        style={{ textAlign: 'center', marginBottom: '3rem' }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '72px', height: '72px',
                                background: 'linear-gradient(135deg, #e67e22, #f39c12)',
                                borderRadius: '50%', marginBottom: '1.25rem',
                                boxShadow: '0 8px 32px rgba(230,126,34,0.25)'
                            }}
                        >
                            <FiShield size={32} color="white" />
                        </motion.div>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: '600', color: '#2c1810',
                            margin: '0 0 1rem', lineHeight: 1.15
                        }}>Privacy Policy</h1>
                        <p style={{
                            fontFamily: "'Lato', sans-serif",
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            color: '#888', maxWidth: '550px',
                            margin: '0 auto', lineHeight: 1.6, fontWeight: '400'
                        }}>
                            Last updated: March 2026 · Your privacy matters to us. Here's how we protect your data.
                        </p>
                    </motion.div>

                    {/* Intro Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '20px',
                            padding: 'clamp(1.5rem, 4vw, 2rem)',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
                            border: '1px solid rgba(230,126,34,0.08)',
                            marginBottom: '2rem',
                            position: 'relative', overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                            background: 'linear-gradient(90deg, #e67e22, #f39c12, #e67e22)',
                            borderRadius: '20px 20px 0 0'
                        }} />
                        <p style={{
                            fontFamily: "'Lato', sans-serif",
                            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                            color: '#555', lineHeight: 1.85, margin: 0, fontWeight: '300'
                        }}>
                            At Recipedia, we believe that your privacy is as important as a perfectly seasoned dish. This policy explains how we collect, use, and protect your personal information when you use our platform. We are committed to transparency and giving you control over your data.
                        </p>
                    </motion.div>

                    {/* Sections */}
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                borderRadius: '16px',
                                padding: 'clamp(1.25rem, 3.5vw, 2rem)',
                                boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                                border: '1px solid rgba(230,126,34,0.06)',
                                marginBottom: '1.25rem'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: 40, height: 40, minWidth: 40,
                                    background: 'linear-gradient(135deg, #e67e22, #f39c12)',
                                    borderRadius: '10px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', boxShadow: '0 3px 10px rgba(230,126,34,0.2)'
                                }}>
                                    <section.icon size={18} />
                                </div>
                                <h2 style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                                    color: '#2c1810', margin: 0, fontWeight: '600'
                                }}>{section.title}</h2>
                            </div>
                            <ul style={{
                                fontFamily: "'Lato', sans-serif",
                                fontSize: 'clamp(0.88rem, 2vw, 0.95rem)',
                                color: '#555', lineHeight: 1.8, margin: 0,
                                paddingLeft: '1.25rem', fontWeight: '400'
                            }}>
                                {section.content.map((item, j) => (
                                    <li key={j} style={{ marginBottom: '0.5rem' }}>{item}</li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        style={{
                            textAlign: 'center', marginTop: '2rem',
                            padding: '2rem',
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: '16px',
                            border: '1px solid rgba(230,126,34,0.08)'
                        }}
                    >
                        <FiMail size={24} color="#e67e22" style={{ marginBottom: '0.75rem' }} />
                        <p style={{
                            fontFamily: "'Lato', sans-serif", fontSize: '0.95rem',
                            color: '#666', margin: 0, lineHeight: 1.6
                        }}>
                            Questions about your privacy? Reach us at{' '}
                            <a href="mailto:privacy@recipedia.com" style={{
                                color: '#e67e22', textDecoration: 'none', fontWeight: '600'
                            }}>privacy@recipedia.com</a>
                        </p>
                    </motion.div>

                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
