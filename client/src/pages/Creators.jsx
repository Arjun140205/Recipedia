import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiHeart,
  FiBook,
  FiMapPin,
  FiSearch,
  FiArrowRight
} from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const Creators = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async (pageNum = 1, reset = true) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://recipedia-2si5.onrender.com/api/creators?page=${pageNum}&limit=12`);

      if (reset) {
        setCreators(response.data.creators);
      } else {
        setCreators(prev => [...prev, ...response.data.creators]);
      }

      setHasMore(pageNum < response.data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast.error('Failed to load creators');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchCreators(page + 1, false);
    }
  };

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.profile.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'all' ||
      creator.profile.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));

    return matchesSearch && matchesSpecialty;
  });

  const CreatorCard = ({ creator, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -6 }}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        border: '1px solid rgba(230, 126, 34, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={creator.profile.avatar || '/default-avatar.jpg'}
          alt={creator.profile.displayName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(44, 24, 16, 0.75))',
          color: 'white',
          padding: '1.25rem 1rem 1rem'
        }}>
          <h3 style={{
            margin: '0',
            fontSize: '1.15rem',
            fontFamily: "'Lato', sans-serif",
            fontWeight: '600',
            letterSpacing: '-0.01em'
          }}>
            {creator.profile.displayName}
          </h3>
          {creator.profile.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.3rem' }}>
              <FiMapPin size={13} />
              <span style={{
                fontSize: '0.85rem',
                fontFamily: "'Lato', sans-serif",
                fontWeight: '300',
                opacity: 0.9
              }}>{creator.profile.location}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '1.25rem 1.25rem 1.5rem' }}>
        {creator.profile.bio && (
          <p style={{
            color: '#666',
            fontSize: '0.88rem',
            lineHeight: '1.55',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontFamily: "'Lato', sans-serif",
            fontWeight: '400'
          }}>
            {creator.profile.bio}
          </p>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          background: 'linear-gradient(135deg, rgba(253, 251, 247, 1) 0%, rgba(255, 248, 240, 1) 100%)',
          borderRadius: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiBook size={15} color="#e67e22" />
            <span style={{
              fontSize: '0.88rem',
              color: '#2c1810',
              fontFamily: "'Lato', sans-serif",
              fontWeight: '500'
            }}>
              {creator.profile.totalRecipes} recipes
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiHeart size={15} color="#e74c3c" />
            <span style={{
              fontSize: '0.88rem',
              color: '#2c1810',
              fontFamily: "'Lato', sans-serif",
              fontWeight: '500'
            }}>
              {creator.profile.totalLikes} likes
            </span>
          </div>
        </div>

        {creator.profile.specialties.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem'
            }}>
              {creator.profile.specialties.slice(0, 3).map((specialty, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: 'rgba(230, 126, 34, 0.08)',
                    color: '#c06010',
                    padding: '0.3rem 0.7rem',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '500',
                    fontFamily: "'Lato', sans-serif",
                    border: '1px solid rgba(230, 126, 34, 0.1)'
                  }}
                >
                  {specialty}
                </span>
              ))}
              {creator.profile.specialties.length > 3 && (
                <span style={{
                  color: '#999',
                  fontSize: '0.78rem',
                  padding: '0.3rem 0.4rem',
                  fontFamily: "'Lato', sans-serif"
                }}>
                  +{creator.profile.specialties.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <Link
          to={`/creator/${creator._id}`}
          className="creator-view-btn"
        >
          View Recipes
          <FiArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Lato:wght@300;400;500;600;700&display=swap');

        .creators-page-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfbf7 0%, #fff8f0 50%, #fdfbf7 100%);
          position: relative;
          overflow: hidden;
        }

        .creators-page-wrapper::before {
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

        .creators-page-wrapper::after {
          content: '';
          position: absolute;
          bottom: -150px;
          left: -150px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(243, 156, 18, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .creators-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        .creators-search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid rgba(230, 126, 34, 0.15);
          border-radius: 12px;
          font-size: 1rem;
          font-family: 'Lato', sans-serif;
          background: rgba(255, 255, 255, 0.9);
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #2D3748;
          box-sizing: border-box;
          -webkit-appearance: none;
        }

        .creators-search-input::placeholder {
          color: #a0aec0;
          font-weight: 400;
        }

        .creators-search-input:focus {
          border-color: #e67e22;
          box-shadow: 0 0 0 4px rgba(230, 126, 34, 0.08);
          background: #fff;
        }

        .creators-filter-select {
          padding: 1rem 2.5rem 1rem 1rem;
          border: 2px solid rgba(230, 126, 34, 0.15);
          border-radius: 12px;
          font-size: 1rem;
          font-family: 'Lato', sans-serif;
          background: rgba(255, 255, 255, 0.9);
          color: #2D3748;
          outline: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23c0a080' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
        }

        .creators-filter-select:focus {
          border-color: #e67e22;
          box-shadow: 0 0 0 4px rgba(230, 126, 34, 0.08);
          background-color: #fff;
        }

        .creator-view-btn {
          display: flex;
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%);
          color: white;
          text-align: center;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 3px 12px rgba(230, 126, 34, 0.2);
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-sizing: border-box;
        }

        .creator-view-btn:hover {
          box-shadow: 0 6px 20px rgba(230, 126, 34, 0.35);
          transform: translateY(-1px);
        }

        .creator-view-btn:active {
          transform: translateY(0);
        }

        .creators-load-more-btn {
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'Lato', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .creators-load-more-btn:hover {
          box-shadow: 0 6px 20px rgba(230, 126, 34, 0.4);
          transform: translateY(-2px);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @media (max-width: 768px) {
          .creators-content {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="creators-page-wrapper">
        <div className="creators-content">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}
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
                boxShadow: '0 8px 32px rgba(230, 126, 34, 0.25)',
                animation: 'float 3s ease-in-out infinite'
              }}
            >
              <FiUsers size={32} color="white" />
            </motion.div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              color: '#2c1810',
              marginBottom: '0.75rem',
              fontWeight: '600',
              lineHeight: '1.15'
            }}>
              Recipe Creators
            </h1>
            <p style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
              color: '#888',
              maxWidth: '550px',
              margin: '0 auto',
              lineHeight: '1.7',
              fontWeight: '300'
            }}>
              Discover amazing home cooks and their delicious recipes from around the world
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '1.5rem',
              borderRadius: '16px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
              border: '1px solid rgba(230, 126, 34, 0.08)',
              marginBottom: '2.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Accent bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #e67e22 0%, #f39c12 50%, #e67e22 100%)',
              borderRadius: '16px 16px 0 0'
            }} />

            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                <FiSearch style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#c0a080',
                  zIndex: 1
                }} />
                <input
                  type="text"
                  placeholder="Search creators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="creators-search-input"
                />
              </div>

              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="creators-filter-select"
              >
                <option value="all">All Specialties</option>
                <option value="dessert">Desserts</option>
                <option value="main">Main Courses</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="baking">Baking</option>
                <option value="healthy">Healthy</option>
              </select>
            </div>
          </motion.div>

          {/* Creators Grid */}
          {loading && creators.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                border: '1px solid rgba(230, 126, 34, 0.08)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.05)'
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '3rem', marginBottom: '1rem' }}
              >
                👨‍🍳
              </motion.div>
              <p style={{
                fontFamily: "'Lato', sans-serif",
                color: '#888',
                fontSize: '1.05rem',
                fontWeight: '400'
              }}>Loading amazing creators...</p>
            </motion.div>
          ) : (
            <>
              <motion.div
                layout
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.75rem',
                  marginBottom: '3rem'
                }}
              >
                <AnimatePresence>
                  {filteredCreators.map((creator, index) => (
                    <CreatorCard key={creator._id} creator={creator} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredCreators.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    border: '1px solid rgba(230, 126, 34, 0.08)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: '#2c1810',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>No creators found</h3>
                  <p style={{
                    fontFamily: "'Lato', sans-serif",
                    color: '#888',
                    fontWeight: '400'
                  }}>
                    Try adjusting your search or filter criteria
                  </p>
                </motion.div>
              )}

              {hasMore && !loading && (
                <div style={{ textAlign: 'center' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMore}
                    className="creators-load-more-btn"
                  >
                    Load More Creators
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Creators;