import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart, FiUsers, FiGlobe, FiStar, FiBook, FiCoffee, FiArrowRight } from 'react-icons/fi';

const AboutUs = () => {
    const values = [
        {
            icon: FiHeart,
            title: 'Made with Love',
            description: 'Every feature we build is inspired by the love families share over homemade meals.'
        },
        {
            icon: FiGlobe,
            title: 'Global Flavors',
            description: 'Recipes from every corner of the world, bringing diverse culinary traditions to your kitchen.'
        },
        {
            icon: FiUsers,
            title: 'Community First',
            description: 'A thriving community of home cooks sharing their passion, tips, and secret ingredients.'
        },
        {
            icon: FiStar,
            title: 'Quality Curated',
            description: 'Every recipe is thoughtfully presented so you can cook with confidence and joy.'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Recipes' },
        { number: '500+', label: 'Creators' },
        { number: '50+', label: 'Cuisines' },
        { number: '∞', label: 'Possibilities' }
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Lato:wght@300;400;500;600;700&display=swap');

        .aboutus-page *,
        .aboutus-page *::before,
        .aboutus-page *::after {
          box-sizing: border-box;
        }

        .aboutus-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfbf7 0%, #fff8f0 50%, #fdfbf7 100%);
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }

        .aboutus-page::before {
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

        .aboutus-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 3rem 2rem 5rem;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .aboutus-container { padding: 2rem 1rem 4rem; }
        }
        @media (max-width: 480px) {
          .aboutus-container { padding: 1.5rem 0.75rem 3rem; }
        }
      `}</style>

            <div className="aboutus-page">
                <div className="aboutus-container">

                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '72px',
                                height: '72px',
                                background: 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)',
                                borderRadius: '50%',
                                marginBottom: '1.25rem',
                                boxShadow: '0 8px 32px rgba(230, 126, 34, 0.25)'
                            }}
                        >
                            <FiCoffee size={32} color="white" />
                        </motion.div>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: '600',
                            color: '#2c1810',
                            margin: '0 0 1rem 0',
                            lineHeight: 1.15
                        }}>
                            About Recipedia
                        </h1>
                        <p style={{
                            fontFamily: "'Lato', sans-serif",
                            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                            color: '#888',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: 1.7,
                            fontWeight: '300'
                        }}>
                            Born from the simple idea that every family deserves delicious, inspired meals — without the stress.
                        </p>
                    </motion.div>

                    {/* Story Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        style={{
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            borderRadius: '20px',
                            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
                            border: '1px solid rgba(230,126,34,0.08)',
                            marginBottom: '3rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                            background: 'linear-gradient(90deg, #e67e22, #f39c12, #e67e22)',
                            borderRadius: '20px 20px 0 0'
                        }} />
                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                            color: '#2c1810',
                            marginBottom: '1.25rem',
                            fontWeight: '600'
                        }}>Our Story</h2>
                        <p style={{
                            fontFamily: "'Lato', sans-serif",
                            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                            color: '#555',
                            lineHeight: 1.85,
                            marginBottom: '1.25rem',
                            fontWeight: '300'
                        }}>
                            Recipedia was born from the everyday challenge familiar to every household — "What should we cook today?" We believe that cooking should be an adventure, not a chore. Whether it's a busy weeknight, a lazy Sunday, or a special celebration, we wanted to create a space where inspiration is always within reach.
                        </p>
                        <p style={{
                            fontFamily: "'Lato', sans-serif",
                            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                            color: '#555',
                            lineHeight: 1.85,
                            fontWeight: '300'
                        }}>
                            Our platform brings together a global community of passionate home cooks, each sharing their unique recipes, stories, and culinary traditions. From quick weekday meals to elaborate weekend feasts, Recipedia empowers families to break the cycle of repetition and discover the joy of cooking something new.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.6 }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '1rem',
                            marginBottom: '3rem'
                        }}
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -4 }}
                                style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    borderRadius: '16px',
                                    padding: '1.5rem 1rem',
                                    textAlign: 'center',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                    border: '1px solid rgba(230,126,34,0.08)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                                    fontWeight: '600',
                                    color: '#e67e22',
                                    marginBottom: '0.25rem'
                                }}>{stat.number}</div>
                                <div style={{
                                    fontFamily: "'Lato', sans-serif",
                                    fontSize: '0.85rem',
                                    color: '#888',
                                    fontWeight: '500'
                                }}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Values */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.6 }}
                    >
                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                            color: '#2c1810',
                            textAlign: 'center',
                            marginBottom: '2rem',
                            fontWeight: '600'
                        }}>What We Stand For</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: '1.25rem'
                        }}>
                            {values.map((v, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    whileHover={{ y: -4 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '1rem',
                                        padding: '1.25rem 1.5rem',
                                        background: 'rgba(255,255,255,0.9)',
                                        borderRadius: '14px',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                        border: '1px solid rgba(230,126,34,0.08)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{
                                        width: 44, height: 44, minWidth: 44,
                                        background: 'linear-gradient(135deg, #e67e22, #f39c12)',
                                        borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(230,126,34,0.2)'
                                    }}>
                                        <v.icon size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontFamily: "'Lato', sans-serif",
                                            fontSize: '1rem', fontWeight: '600', color: '#2c1810',
                                            margin: '0 0 0.2rem'
                                        }}>{v.title}</h3>
                                        <p style={{
                                            fontFamily: "'Lato', sans-serif",
                                            fontSize: '0.85rem', color: '#888', margin: 0,
                                            lineHeight: 1.5, fontWeight: '400'
                                        }}>{v.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        style={{ textAlign: 'center', marginTop: '3rem' }}
                    >
                        <Link to="/recipes" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '1rem 2rem',
                            background: 'linear-gradient(135deg, #e67e22, #f39c12)',
                            color: 'white',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontFamily: "'Lato', sans-serif",
                            fontWeight: '600',
                            fontSize: '1rem',
                            boxShadow: '0 4px 15px rgba(230,126,34,0.3)',
                            transition: 'all 0.3s ease'
                        }}>
                            Start Exploring Recipes <FiArrowRight />
                        </Link>
                    </motion.div>

                </div>
            </div>
        </>
    );
};

export default AboutUs;
