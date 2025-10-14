import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, 
  FiBook, 
  FiMapPin, 
  FiUsers,
  FiClock,
  FiPlay
} from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import RecipeCard from '../component/RecipeCard';

const CreatorProfile = () => {
  const { userId } = useParams();
  const [creator, setCreator] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchCreatorProfile();
      fetchCreatorRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchCreatorProfile = async () => {
    try {
      const response = await axios.get(`https://recipedia-2si5.onrender.com/api/user/profile/${userId}`);
      setCreator(response.data);
    } catch (error) {
      console.error('Error fetching creator profile:', error);
      toast.error('Failed to load creator profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatorRecipes = async (pageNum = 1, reset = true) => {
    try {
      setRecipesLoading(true);
      const response = await axios.get(`https://recipedia-2si5.onrender.com/api/creators/${userId}/recipes?page=${pageNum}&limit=12`);
      
      if (reset) {
        setRecipes(response.data.recipes);
      } else {
        setRecipes(prev => [...prev, ...response.data.recipes]);
      }
      
      setHasMore(pageNum < response.data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching creator recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setRecipesLoading(false);
    }
  };

  const loadMoreRecipes = () => {
    if (hasMore && !recipesLoading) {
      fetchCreatorRecipes(page + 1, false);
    }
  };

  const RecipeModal = ({ recipe, onClose }) => {
    if (!recipe) return null;

    const ingredientsList = recipe.ingredients || [];
    const instructionsList = recipe.instructions ? recipe.instructions.split('\n').filter(Boolean) : [];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 1
            }}
          >
            ×
          </button>

          <div style={{ position: 'relative' }}>
            <img
              src={recipe.image || '/default-recipe-image.jpg'}
              alt={recipe.title}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover'
              }}
            />
            {recipe.video && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white'
              }}>
                <FiPlay size={24} />
              </div>
            )}
          </div>

          <div style={{ padding: '2rem' }}>
            <h2 style={{ margin: '0 0 1rem 0', color: '#333' }}>
              {recipe.title}
            </h2>

            <div style={{
              display: 'flex',
              gap: '2rem',
              marginBottom: '2rem',
              color: '#666'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiClock />
                <span>{recipe.prepTime} mins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiUsers />
                <span>Serves {recipe.servings}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiHeart />
                <span>{recipe.totalLikes} likes</span>
              </div>
            </div>

            {recipe.description && (
              <p style={{
                color: '#666',
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                {recipe.description}
              </p>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
              gap: '2rem'
            }}>
              <div>
                <h3 style={{ color: '#e67e22', marginBottom: '1rem' }}>
                  Ingredients
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {ingredientsList.map((ingredient, index) => (
                    <li key={index} style={{
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#e67e22',
                        borderRadius: '50%'
                      }} />
                      {typeof ingredient === 'string' ? ingredient : `${ingredient.amount} ${ingredient.name}`}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 style={{ color: '#e67e22', marginBottom: '1rem' }}>
                  Instructions
                </h3>
                <ol style={{ padding: 0, listStylePosition: 'inside' }}>
                  {instructionsList.map((instruction, index) => (
                    <li key={index} style={{
                      padding: '0.75rem 0',
                      borderBottom: '1px solid #f0f0f0',
                      lineHeight: '1.6'
                    }}>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {recipe.video && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#e67e22', marginBottom: '1rem' }}>
                  Recipe Video
                </h3>
                <video
                  controls
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px'
                  }}
                >
                  <source src={recipe.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🍳</div>
        <p>Loading creator profile...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
        <h2>Creator not found</h2>
        <p>The creator you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      {/* Creator Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <img
            src={creator.profile.avatar || '/default-avatar.jpg'}
            alt={creator.profile.displayName}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #e67e22'
            }}
          />
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{
              margin: '0 0 0.5rem 0',
              fontSize: '2.5rem',
              color: '#333'
            }}>
              {creator.profile.displayName}
            </h1>
            
            {creator.profile.location && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
                color: '#666'
              }}>
                <FiMapPin />
                <span>{creator.profile.location}</span>
              </div>
            )}

            {creator.profile.bio && (
              <p style={{
                color: '#666',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                {creator.profile.bio}
              </p>
            )}

            <div style={{
              display: 'flex',
              gap: '2rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#e67e22'
                }}>
                  {creator.profile.totalRecipes}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  Recipes
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#e74c3c'
                }}>
                  {creator.profile.totalLikes}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  Likes
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#3498db'
                }}>
                  {creator.profile.followers?.length || 0}
                </div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  Followers
                </div>
              </div>
            </div>

            {creator.profile.specialties.length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                  Specialties
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {creator.profile.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#f8f9fa',
                        color: '#e67e22',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Recipes Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 style={{
          fontSize: '2rem',
          color: '#333',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <FiBook />
          Recipes by {creator.profile.displayName}
        </h2>

        {recipesLoading && recipes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            backgroundColor: 'white',
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍳</div>
            <p>Loading recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            backgroundColor: 'white',
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3>No recipes yet</h3>
            <p style={{ color: '#666' }}>
              {creator.profile.displayName} hasn't shared any recipes yet.
            </p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onSelect={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadMoreRecipes}
                  disabled={recipesLoading}
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: recipesLoading ? '#ccc' : '#e67e22',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: recipesLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {recipesLoading ? 'Loading...' : 'Load More Recipes'}
                </motion.button>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatorProfile;