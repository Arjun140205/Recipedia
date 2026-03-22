import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiCheck, FiAlertCircle, FiEdit3, FiUsers, FiMail } from 'react-icons/fi';

const TermsOfService = () => {
    const sections = [
        {
            icon: FiCheck,
            title: 'Acceptance of Terms',
            paragraphs: [
                'By accessing or using Recipedia, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.',
                'We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes.'
            ]
        },
        {
            icon: FiUsers,
            title: 'User Accounts',
            paragraphs: [
                'You may browse recipes without an account. To share recipes as a creator, you must register with a unique username and secure password.',
                'You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility.',
                'You must be at least 13 years of age to create an account. By registering, you represent that you meet this requirement.'
            ]
        },
        {
            icon: FiEdit3,
            title: 'Content Guidelines',
            paragraphs: [
                'As a creator, you retain ownership of the recipes and content you share on Recipedia. By posting, you grant us a non-exclusive license to display, distribute, and promote your content on the platform.',
                'You agree not to post content that is offensive, harmful, misleading, or infringes on the intellectual property rights of others.',
                'We reserve the right to remove content that violates these guidelines and to suspend accounts that repeatedly breach these terms.'
            ]
        },
        {
            icon: FiAlertCircle,
            title: 'Limitation of Liability',
            paragraphs: [
                'Recipedia is provided "as is" without warranties of any kind. We do not guarantee the accuracy or completeness of any recipe or nutritional information shared on the platform.',
                'We are not liable for any adverse reactions, injuries, or damages resulting from recipes found on our platform. Always exercise your own judgment and consider dietary restrictions and allergies.',
                'Our total liability to you for any claims arising from use of the service shall not exceed the amount paid by you, if any, to Recipedia in the past 12 months.'
            ]
        }
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Lato:wght@300;400;500;600;700&display=swap');

        .terms-page *, .terms-page *::before, .terms-page *::after { box-sizing: border-box; }

        .terms-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfbf7 0%, #fff8f0 50%, #fdfbf7 100%);
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }

        .terms-page::before {
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

        .terms-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem 2rem 5rem;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) { .terms-container { padding: 2rem 1rem 4rem; } }
        @media (max-width: 480px) { .terms-container { padding: 1.5rem 0.75rem 3rem; } }
      `}</style>

            <div className="terms-page">
                <div className="terms-container">

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
                            <FiFileText size={32} color="white" />
                        </motion.div>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: '600', color: '#2c1810',
                            margin: '0 0 1rem', lineHeight: 1.15
                        }}>Terms of Service</h1>
                        <p style={{
                            fontFamily: "'Lato', sans-serif",
                            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                            color: '#888', maxWidth: '550px',
                            margin: '0 auto', lineHeight: 1.6, fontWeight: '400'
                        }}>
                            Last updated: March 2026 · Please read these terms carefully before using Recipedia.
                        </p>
                    </motion.div>

                    {/* Sections */}
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: i === 0 ? '20px' : '16px',
                                padding: 'clamp(1.25rem, 3.5vw, 2rem)',
                                boxShadow: i === 0 ? '0 8px 40px rgba(0,0,0,0.06)' : '0 2px 16px rgba(0,0,0,0.04)',
                                border: '1px solid rgba(230,126,34,0.08)',
                                marginBottom: '1.25rem',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {i === 0 && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                                    background: 'linear-gradient(90deg, #e67e22, #f39c12, #e67e22)',
                                    borderRadius: '20px 20px 0 0'
                                }} />
                            )}
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
                            {section.paragraphs.map((p, j) => (
                                <p key={j} style={{
                                    fontFamily: "'Lato', sans-serif",
                                    fontSize: 'clamp(0.88rem, 2vw, 0.95rem)',
                                    color: '#555', lineHeight: 1.85,
                                    margin: j < section.paragraphs.length - 1 ? '0 0 1rem' : 0,
                                    fontWeight: '300'
                                }}>{p}</p>
                            ))}
                        </motion.div>
                    ))}

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
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
                            Questions about these terms? Contact us at{' '}
                            <a href="mailto:legal@recipedia.com" style={{
                                color: '#e67e22', textDecoration: 'none', fontWeight: '600'
                            }}>legal@recipedia.com</a>
                        </p>
                    </motion.div>

                </div>
            </div>
        </>
    );
};

export default TermsOfService;
