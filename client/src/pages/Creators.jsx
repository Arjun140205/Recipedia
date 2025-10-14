import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiHeart, 
  FiBook, 
  FiMapPin,
  FiSearch
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

  const CreatorCard = ({ creator }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img
          src={creator.profile.avatar || '/default-avatar.jpg'}
          alt={creator.profile.displayName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          color: 'white',
          padding: '1rem'
        }}>
          <h3 style={{ margin: '0', fontSize: '1.2rem' }}>
            {creator.profile.displayName}
          </h3>
          {creator.profile.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
              <FiMapPin size={14} />
              <span style={{ fontSize: '0.9rem' }}>{creator.profile.location}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {creator.profile.bio && (
          <p style={{
            color: '#666',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {creator.profile.bio}
          </p>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiBook size={16} color="#e67e22" />
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              {creator.profile.totalRecipes} recipes
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiHeart size={16} color="#e74c3c" />
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              {creator.profile.totalLikes} likes
            </span>
          </div>
        </div>

        {creator.profile.specialties.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {creator.profile.specialties.slice(0, 3).map((specialty, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#f8f9fa',
                    color: '#e67e22',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  {specialty}
                </span>
              ))}
              {creator.profile.specialties.length > 3 && (
                <span style={{
                  color: '#666',
                  fontSize: '0.8rem',
                  padding: '0.25rem'
                }}>
                  +{creator.profile.specialties.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <Link
          to={`/creator/${creator._id}`}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#e67e22',
            color: 'white',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d35400'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#e67e22'}
        >
          View Recipes
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}
      >
        <h1 style={{
          fontSize: '3rem',
          color: '#333',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <FiUsers />
          Recipe Creators
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto'
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
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '3rem'
        }}
      >
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
              color: '#666'
            }} />
            <input
              type="text"
              placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
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
        <div style={{
          textAlign: 'center',
          padding: '4rem',
          backgroundColor: 'white',
          borderRadius: '16px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🍳</div>
          <p>Loading amazing creators...</p>
        </div>
      ) : (
        <>
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}
          >
            <AnimatePresence>
              {filteredCreators.map((creator, index) => (
                <CreatorCard key={creator._id} creator={creator} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredCreators.length === 0 && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '4rem',
              backgroundColor: 'white',
              borderRadius: '16px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3>No creators found</h3>
              <p style={{ color: '#666' }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {hasMore && !loading && (
            <div style={{ textAlign: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMore}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#e67e22',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Load More Creators
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Creators;