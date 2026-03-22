import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMessageSquare, FiSend, FiMapPin, FiClock, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        setTimeout(() => {
            toast.success("Message sent! We'll get back to you soon 🍳");
            setForm({ name: '', email: '', subject: '', message: '' });
            setSending(false);
        }, 1200);
    };

    const contactCards = [
        { icon: FiMail, title: 'Email Us', detail: 'hello@recipedia.com', sub: 'General inquiries' },
        { icon: FiClock, title: 'Response Time', detail: 'Within 24 hours', sub: 'We reply fast!' },
        { icon: FiMapPin, title: 'Community', detail: 'Global', sub: 'Worldwide passion' },
    ];

    const inputBase = {
        width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px',
        border: '2px solid rgba(230,126,34,0.15)', fontSize: '1rem',
        fontFamily: "'Lato', sans-serif", background: 'rgba(255,255,255,0.9)',
        outline: 'none', color: '#2D3748', boxSizing: 'border-box', maxWidth: '100%',
        WebkitAppearance: 'none', transition: 'all 0.3s ease'
    };

    const textareaStyle = {
        ...inputBase, padding: '1rem', minHeight: '140px', resize: 'vertical', lineHeight: 1.6
    };

    const iconStyle = {
        position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#c0a080', zIndex: 1
    };

    const labelStyle = {
        display: 'block', marginBottom: '0.4rem', color: '#2c1810',
        fontWeight: '500', fontSize: '0.9rem', fontFamily: "'Lato', sans-serif"
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Lato:wght@300;400;500;600;700&display=swap');
        .contact-page *, .contact-page *::before, .contact-page *::after { box-sizing: border-box; }
        .contact-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfbf7 0%, #fff8f0 50%, #fdfbf7 100%);
          overflow-x: hidden; width: 100%; position: relative;
        }
        .contact-page::before {
          content: ''; position: absolute; top: -200px; right: -200px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(230,126,34,0.06) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }
        .contact-container {
          max-width: 900px; margin: 0 auto; padding: 3rem 2rem 5rem;
          position: relative; z-index: 1;
        }
        @media (max-width: 768px) { .contact-container { padding: 2rem 1rem 4rem; } }
        @media (max-width: 480px) { .contact-container { padding: 1.5rem 0.75rem 3rem; } }
      `}</style>

            <div className="contact-page">
                <div className="contact-container">
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
                            <FiMessageSquare size={32} color="white" />
                        </motion.div>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 600, color: '#2c1810', margin: '0 0 1rem', lineHeight: 1.15 }}>
                            Get in Touch
                        </h1>
                        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 'clamp(1rem,2.5vw,1.1rem)', color: '#888', maxWidth: 500, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
                            We'd love to hear from you — feedback, ideas, or even your favorite recipe!
                        </p>
                    </motion.div>

                    {/* Info Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                        {contactCards.map((c, i) => (
                            <motion.div key={i} whileHover={{ y: -4 }} style={{
                                background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '1.5rem',
                                textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                border: '1px solid rgba(230,126,34,0.08)', transition: 'all 0.3s ease'
                            }}>
                                <div style={{ width: 44, height: 44, margin: '0 auto 0.75rem', background: 'linear-gradient(135deg, #e67e22, #f39c12)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <c.icon size={20} />
                                </div>
                                <h3 style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.95rem', fontWeight: 600, color: '#2c1810', margin: '0 0 0.25rem' }}>{c.title}</h3>
                                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.9rem', color: '#e67e22', fontWeight: 500, margin: '0 0 0.15rem' }}>{c.detail}</p>
                                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: '0.8rem', color: '#aaa', margin: 0 }}>{c.sub}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Form */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        style={{
                            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderRadius: 20,
                            padding: 'clamp(1.5rem,4vw,2.5rem)', boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
                            border: '1px solid rgba(230,126,34,0.08)', position: 'relative', overflow: 'hidden'
                        }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #e67e22, #f39c12, #e67e22)', borderRadius: '20px 20px 0 0' }} />
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.4rem,3.5vw,1.8rem)', color: '#2c1810', marginBottom: '1.5rem', fontWeight: 600, textAlign: 'center' }}>
                            Send Us a Message
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiUser style={iconStyle} />
                                        <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} style={inputBase} required />
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiMail style={iconStyle} />
                                        <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} style={inputBase} required />
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Subject</label>
                                <div style={{ position: 'relative' }}>
                                    <FiMessageSquare style={iconStyle} />
                                    <input name="subject" placeholder="What's this about?" value={form.subject} onChange={handleChange} style={inputBase} required />
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>Message</label>
                                <textarea name="message" placeholder="Tell us what's on your mind..." value={form.message} onChange={handleChange} style={textareaStyle} required />
                            </div>
                            <motion.button type="submit" disabled={sending} whileHover={{ scale: sending ? 1 : 1.02 }} whileTap={{ scale: sending ? 1 : 0.98 }}
                                style={{
                                    width: '100%', padding: '1rem', background: sending ? 'linear-gradient(135deg, #bdc3c7, #95a5a6)' : 'linear-gradient(135deg, #e67e22, #f39c12)',
                                    color: 'white', border: 'none', borderRadius: 12, fontSize: '1.05rem', fontWeight: 600,
                                    fontFamily: "'Lato', sans-serif", cursor: sending ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    boxShadow: sending ? 'none' : '0 4px 15px rgba(230,126,34,0.3)', boxSizing: 'border-box'
                                }}>
                                {sending ? 'Sending...' : <><FiSend /> Send Message</>}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Contact;
