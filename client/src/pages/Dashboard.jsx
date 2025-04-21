import { useEffect, useState } from 'react';
import { createRecipe, getRecipes, deleteRecipe, updateRecipe } from '../api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaTrash, FaUtensils, FaEdit } from 'react-icons/fa';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    image: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await getRecipes();
      setRecipes(res.data);
    } catch (err) {
      toast.error('Failed to fetch recipes');
      console.error('Failed to fetch recipes:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files?.[0]) {
      setNewRecipe(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setNewRecipe(prev => ({ ...prev, [name]: value }));
    }
    setError(''); // Clear error when user makes changes
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      // Add all recipe data to FormData
      Object.entries(newRecipe).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      const response = await createRecipe(formData);
      if (response.data) {
        setShowForm(false);
        setNewRecipe({ title: '', ingredients: '', instructions: '', image: null });
        fetchRecipes();
        toast.success('Recipe created successfully! 🎉');
      }
    } catch (err) {
      console.error('Could not create recipe:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create recipe. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(recipeId);
        toast.success('Recipe deleted successfully');
        setSelectedRecipe(null);
        fetchRecipes();
      } catch (err) {
        toast.error('Failed to delete recipe');
        console.error('Delete error:', err);
      }
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe({
      ...recipe,
      image: null // Don't preload the image file
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files?.[0]) {
      setEditingRecipe(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setEditingRecipe(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      // Add all recipe data to FormData
      Object.entries(editingRecipe).forEach(([key, value]) => {
        if (value && key !== '_id') {
          formData.append(key, value);
        }
      });

      const response = await updateRecipe(editingRecipe._id, formData);
      if (response.data) {
        setEditingRecipe(null);
        fetchRecipes();
        toast.success('Recipe updated successfully! 🎉');
      }
    } catch (err) {
      console.error('Could not update recipe:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update recipe. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  return (
  
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)'
    }}>
     { console.log(recipes)}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '1.5rem 2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <div>
            <h1 style={{ 
              margin: '0',
              color: '#333',
              fontSize: '2.5rem',
              fontWeight: '600'
            }}>My Recipes</h1>
            <p style={{
              margin: '0.5rem 0 0 0',
              color: '#666',
              fontSize: '1.1rem'
            }}>Create and manage your personal recipe collection</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: showForm ? '#e74c3c' : '#e67e22',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s ease'
            }}
          >
            {showForm ? (
              <>
                <FaTimes /> Cancel
              </>
            ) : (
              <>
                <FaPlus /> Add New Recipe
              </>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginBottom: '2rem',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: '#e74c3c',
                    backgroundColor: '#fde8e8',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaTimes style={{ color: '#e74c3c' }} />
                  {error}
                </motion.div>
              )}
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#444',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}>
                  Recipe Title
                  <input
                    type="text"
                    name="title"
                    value={newRecipe.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter recipe title..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(230, 126, 34, 0.3)',
                      marginTop: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#444',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}>
                  Ingredients
                  <textarea
                    name="ingredients"
                    value={newRecipe.ingredients}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter ingredients (one per line)..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(230, 126, 34, 0.3)',
                      minHeight: '120px',
                      marginTop: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      resize: 'vertical'
                    }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#444',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}>
                  Instructions
                  <textarea
                    name="instructions"
                    value={newRecipe.instructions}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter cooking instructions..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(230, 126, 34, 0.3)',
                      minHeight: '200px',
                      marginTop: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      resize: 'vertical'
                    }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#444',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}>
                  Recipe Image
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(230, 126, 34, 0.3)',
                      marginTop: '0.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                  />
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  backgroundColor: '#e67e22',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  width: '100%',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaUtensils />
                {loading ? 'Creating Recipe...' : 'Create Recipe'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
          }}
        >
          {recipes.map((recipe) => (
            <motion.div
              key={recipe._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -10 }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              {recipe.image && (
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={`http://localhost:8000/${recipe.image}`}
                    alt={recipe.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)'
                  }} />
                </div>
              )}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  margin: '0', 
                  marginBottom: '0.75rem',
                  fontSize: '1.3rem',
                  color: '#333',
                  fontWeight: '600'
                }}>{recipe.title}</h3>
                <p style={{ 
                  margin: '0 0 1.5rem 0',
                  color: '#666',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: '1.6'
                }}>
                  {recipe.instructions}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '0.75rem'
                }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    style={{
                      flex: 1,
                      backgroundColor: '#e67e22',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                  >
                    View Recipe
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(recipe)}
                    style={{
                      backgroundColor: 'rgba(52, 152, 219, 0.1)',
                      color: '#3498db',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(recipe._id)}
                    style={{
                      backgroundColor: 'rgba(231, 76, 60, 0.1)',
                      color: '#e74c3c',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {selectedRecipe && (
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
                backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
              onClick={() => setSelectedRecipe(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '2rem',
                  maxWidth: '800px',
                  width: '90%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
                onClick={e => e.stopPropagation()}
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedRecipe(null)}
                  style={{
                    position: 'absolute',
                    right: '1.5rem',
                    top: '1.5rem',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 2
                  }}
                >
                  <FaTimes />
                </motion.button>

                {selectedRecipe.image && (
                  <div style={{
                    position: 'relative',
                    marginBottom: '2rem',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={`http://localhost:8000/${selectedRecipe.image}`}
                      alt={selectedRecipe.title}
                      style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '2rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)'
                    }}>
                      <h2 style={{
                        color: 'white',
                        margin: 0,
                        fontSize: '2rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>{selectedRecipe.title}</h2>
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{
                    color: '#444',
                    fontSize: '1.4rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <FaUtensils />
                    Ingredients
                  </h3>
                  <div style={{
                    backgroundColor: 'rgba(230, 126, 34, 0.1)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.8'
                  }}>
                    {selectedRecipe.ingredients}
                  </div>
                </div>

                <div>
                  <h3 style={{
                    color: '#444',
                    fontSize: '1.4rem',
                    marginBottom: '1rem'
                  }}>Instructions</h3>
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.8'
                  }}>
                    {selectedRecipe.instructions}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingRecipe && (
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
                backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
              onClick={() => setEditingRecipe(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '2rem',
                  maxWidth: '800px',
                  width: '90%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
                onClick={e => e.stopPropagation()}
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditingRecipe(null)}
                  style={{
                    position: 'absolute',
                    right: '1.5rem',
                    top: '1.5rem',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: 2
                  }}
                >
                  <FaTimes />
                </motion.button>

                <h2 style={{ marginBottom: '2rem' }}>Edit Recipe</h2>

                <form onSubmit={handleEditSubmit}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem',
                      color: '#444',
                      fontSize: '1.1rem',
                      fontWeight: '500'
                    }}>
                      Recipe Title
                      <input
                        type="text"
                        name="title"
                        value={editingRecipe.title}
                        onChange={handleEditInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(230, 126, 34, 0.3)',
                          marginTop: '0.5rem',
                          fontSize: '1rem'
                        }}
                      />
                    </label>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem',
                      color: '#444',
                      fontSize: '1.1rem',
                      fontWeight: '500'
                    }}>
                      Ingredients
                      <textarea
                        name="ingredients"
                        value={editingRecipe.ingredients}
                        onChange={handleEditInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(230, 126, 34, 0.3)',
                          minHeight: '120px',
                          marginTop: '0.5rem',
                          fontSize: '1rem',
                          resize: 'vertical'
                        }}
                      />
                    </label>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem',
                      color: '#444',
                      fontSize: '1.1rem',
                      fontWeight: '500'
                    }}>
                      Instructions
                      <textarea
                        name="instructions"
                        value={editingRecipe.instructions}
                        onChange={handleEditInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(230, 126, 34, 0.3)',
                          minHeight: '200px',
                          marginTop: '0.5rem',
                          fontSize: '1rem',
                          resize: 'vertical'
                        }}
                      />
                    </label>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem',
                      color: '#444',
                      fontSize: '1.1rem',
                      fontWeight: '500'
                    }}>
                      Update Recipe Image
                      <input
                        type="file"
                        name="image"
                        onChange={handleEditInputChange}
                        accept="image/*"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(230, 126, 34, 0.3)',
                          marginTop: '0.5rem'
                        }}
                      />
                    </label>
                    {editingRecipe.image && typeof editingRecipe.image === 'string' && (
                      <div style={{ marginTop: '1rem' }}>
                        <p style={{ color: '#666', marginBottom: '0.5rem' }}>Current Image:</p>
                        <img 
                          src={`http://localhost:8000/${editingRecipe.image}`}
                          alt={editingRecipe.title}
                          style={{
                            maxWidth: '200px',
                            borderRadius: '8px'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    style={{
                      backgroundColor: '#e67e22',
                      color: 'white',
                      border: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: '500',
                      width: '100%',
                      opacity: loading ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {loading ? 'Updating Recipe...' : 'Update Recipe'}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes slideIn {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }

            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }

            ::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb {
              background: rgba(230, 126, 34, 0.5);
              border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
              background: rgba(230, 126, 34, 0.7);
            }
          `}
        </style>
      </motion.div>
    </div>
  );
};

export default Dashboard;
