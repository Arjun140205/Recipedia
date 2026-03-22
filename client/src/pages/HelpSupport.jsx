import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHelpCircle, FiChevronDown, FiChevronUp, FiBook, FiUser, FiCamera, FiShield, FiMail, FiMessageSquare } from 'react-icons/fi';

const HelpSupport = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const categories = [
        { icon: FiBook, title: 'Recipes', desc: 'Browsing, searching, and saving recipes' },
        { icon: FiUser, title: 'Account', desc: 'Profile settings and creator tools' },
        { icon: FiCamera, title: 'Sharing', desc: 'Uploading recipes and media' },
        { icon: FiShield, title: 'Privacy', desc: 'Data protection and security' },
    ];

    const faqs = [
        { q: 'How do I search for recipes?', a: 'Use the search bar on the Recipes page to search by name, ingredient, or cuisine. You can also browse by categories like Desserts, Main Courses, and more.' },
        { q: 'How do I become a creator?', a: "Click 'Get Started' or 'Sign Up' in the navigation bar. Choose a username and password, and you'll be ready to share your recipes with the world!" },
        { q: 'Can I save my favorite recipes?', a: 'Yes! Once logged in, you can like and save recipes to your dashboard. They will be accessible anytime from the My Recipes section.' },
        { q: 'How does Fridge Mate work?', a: 'Fridge Mate lets you enter the ingredients you have on hand, and it suggests recipes you can make with what you already have. No more wasted groceries!' },
        { q: 'How do I upload a recipe?', a: 'Go to your Dashboard and click the Add Recipe button. Fill in the title, ingredients, instructions, and upload a photo. Your recipe will be published on your creator profile.' },
        { q: 'Is Recipedia free to use?', a: 'Absolutely! Recipedia is completely free for everyone — both for browsing recipes and for creators sharing their culinary creations.' },
        { q: 'How do I delete my account?', a: 'You can request account deletion by contacting us at hello@recipedia.com. We will process your request and remove all associated data.' },
        { q: 'Can I edit a recipe after publishing?', a: 'Yes, you can edit any of your recipes from the Dashboard. Just click on the recipe you want to update and make your changes.' },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Lato:wght@300;400;500;600;700&display=swap');
        .help-page *, .help-page *::before, .help-page *::after { box-sizing: border-box; }
        .help-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfbf7 0%, #fff8f0 50%, #fdfbf7 100%);
          overflow-x: hidden; width: 100%; position: relative;
        }
        .help-page::before {
          content: ''; position: absolute; top: -200px; right: -200px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(230,126,34,0.06) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }
        .help-container {
          max-width: 850px; margin: 0 auto; padding: 3rem 2rem 5rem;
          position: relative; z-index: 1;
        }
        @media (max-width: 768px) { .help-container { padding: 2rem 1rem 4rem; } }
        @media (max-width: 480px) { .help-container { padding: 1.5rem 0.75rem 3rem; } }

        .faq-item { cursor: pointer; transition: all 0.3s ease; }
        .faq-item:hover { border-color: rgba(230,126,34,0.2) !important; }
      `}</style>

            <div className="help-page">
                <div className="help-container">
                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                        style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 72, height: 72, background: 'linear-gradient(135deg, #e67e22, #f39c12)',
                                borderRadius: '50%', marginBottom: '1.25rem',
                                boxShadow: '0 8px 32px rgba(230,126,34,0.25)'
                            }}>
                            <FiHelpCircle size={32} color="white" />
                        </motion.div>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 600, color: '#2c1810', margin: '0 0 1rem', lineHeight: 1.15 }}>
                            Help & Support
                        </h1>
                        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(1rem,2.5vw,1.1rem)', color: '#888', maxWidth: 550, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
                            Find answers to common questions or reach out for assistance.
                        </p>
                    </motion.div>

                    {/* Categories */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                        {categories.map((cat, i) => (
                            <motion.div key={i} whileHover={{ y: -4 }} style={{
                                background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '1.5rem 1.25rem',
                                textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                border: '1px solid rgba(230,126,34,0.08)', transition: 'all 0.3s ease'
                            }}>
                                <div style={{ width: 42, height: 42, margin: '0 auto 0.75rem', background: 'linear-gradient(135deg, #e67e22, #f39c12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <cat.icon size={20} />
                                </div>
                                <h3 style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.95rem', fontWeight: 600, color: '#2c1810', margin: '0 0 0.2rem' }}>{cat.title}</h3>
                                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.8rem', color: '#999', margin: 0 }}>{cat.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* FAQ */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.5rem,3.5vw,2rem)', color: '#2c1810', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>
                            Frequently Asked Questions
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {faqs.map((faq, i) => (
                                <motion.div key={i} className="faq-item"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    style={{
                                        background: 'rgba(255,255,255,0.95)', borderRadius: 14,
                                        padding: 'clamp(1rem,3vw,1.5rem)',
                                        boxShadow: openFaq === i ? '0 4px 20px rgba(230,126,34,0.1)' : '0 2px 12px rgba(0,0,0,0.03)',
                                        border: `1px solid ${openFaq === i ? 'rgba(230,126,34,0.15)' : 'rgba(230,126,34,0.06)'}`,
                                        overflow: 'hidden'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                                        <h3 style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.9rem,2vw,1rem)', fontWeight: 600, color: openFaq === i ? '#e67e22' : '#2c1810', margin: 0, flex: 1 }}>
                                            {faq.q}
                                        </h3>
                                        <div style={{ color: '#e67e22', minWidth: 20 }}>
                                            {openFaq === i ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}>
                                                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(0.85rem,2vw,0.95rem)', color: '#666', lineHeight: 1.75, margin: '1rem 0 0', fontWeight: 400 }}>
                                                    {faq.a}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                        style={{
                            textAlign: 'center', marginTop: '3rem', padding: '2rem',
                            background: 'rgba(255,255,255,0.95)', borderRadius: 20,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                            border: '1px solid rgba(230,126,34,0.08)'
                        }}>
                        <FiMessageSquare size={28} color="#e67e22" style={{ marginBottom: '0.75rem' }} />
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.2rem,3vw,1.5rem)', color: '#2c1810', margin: '0 0 0.5rem', fontWeight: 600 }}>
                            Still have questions?
                        </h3>
                        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.95rem', color: '#888', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
                            We're here to help! Reach out and we'll get back to you within 24 hours.
                        </p>
                        <Link to="/contact" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.875rem 2rem', background: 'linear-gradient(135deg, #e67e22, #f39c12)',
                            color: 'white', borderRadius: 12, textDecoration: 'none',
                            fontFamily: "'Lato', sans-serif", fontWeight: 600, fontSize: '0.95rem',
                            boxShadow: '0 4px 15px rgba(230,126,34,0.3)'
                        }}>
                            <FiMail /> Contact Us
                        </Link>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default HelpSupport;
