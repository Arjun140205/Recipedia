import { useState, useId, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaUtensils, FaGlobeAmericas } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Utility function to generate unique keys for recipes
const generateUniqueRecipeKey = (recipe, index, prefix = 'recipe') => {
  const id = recipe.idMeal || recipe.id || `unknown-${index}`;
  const randomStr = Math.random().toString(36).substr(2, 9);
  const title = recipe.strMeal ? recipe.strMeal.replace(/\s+/g, '-').toLowerCase().substr(0, 10) : 'no-title';
  return `${prefix}-${id}-${index}-${title}-${randomStr}`;
};

const FridgeMate = () => {
  const componentId = useId();
  const [recipes, setRecipes] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [textareaHeight, setTextareaHeight] = useState('100px');
  
  // Debug log to check environment variables
  console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    API_KEY_EXISTS: !!process.env.REACT_APP_SPOONACULAR_API_KEY,
  });

  const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

  useEffect(() => {
    // Verify API key on component mount
    if (!SPOONACULAR_API_KEY) {
      console.error('Spoonacular API key is not configured. Please check:',
        '\n1. .env file exists in project root',
        '\n2. .env has REACT_APP_SPOONACULAR_API_KEY=your_api_key',
        '\n3. React app was restarted after adding .env'
      );
      toast.error('Recipe service is not properly configured. Please check API settings.');
    } else {
      console.log('API key is configured successfully');
    }
  }, [SPOONACULAR_API_KEY]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setTextareaHeight(window.innerWidth <= 768 ? '120px' : '100px');
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const analyzeIngredients = async (ingredientsText) => {
    if (!SPOONACULAR_API_KEY) {
      throw new Error('API key is not configured');
    }

    try {
      const params = new URLSearchParams();
      params.append('ingredientList', ingredientsText);
      params.append('language', 'en');

      const response = await axios.post(
        `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${SPOONACULAR_API_KEY}`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      return response.data.map(item => ({
        name: item.name,
        id: item.id,
        amount: item.amount,
        unit: item.unit
      }));
    } catch (error) {
      console.error('Error analyzing ingredients:', error);
      if (error.response?.status === 401) {
        toast.error('API authentication failed. Please check API key configuration.');
      } else if (error.response?.status === 402) {
        toast.error('API quota exceeded. Please try again later.');
      } else {
        toast.error('Error analyzing ingredients. Please try again.');
      }
      throw error;
    }
  };

  const searchByIngredients = async () => {
    if (!availableIngredients.trim()) {
      toast.error('Please add some ingredients to search for recipes');
      return;
    }

    if (!SPOONACULAR_API_KEY) {
      toast.error('Recipe service is not properly configured. Please check API settings.');
      return;
    }

    setLoading(true);
    try {
      // First, analyze ingredients using Spoonacular's NLP
      const analyzedIngredients = await analyzeIngredients(availableIngredients);
      
      if (!analyzedIngredients || analyzedIngredients.length === 0) {
        toast.error('Please enter valid ingredients!');
        setLoading(false);
        return;
      }

      // Search for recipes using analyzed ingredients
      const ingredientQuery = analyzedIngredients.map(ing => ing.name).join(',+');
      const searchUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${encodeURIComponent(ingredientQuery)}&number=12&ranking=2&ignorePantry=true`;
      
      const response = await axios.get(searchUrl);
      const recipes = response.data;

      // Get detailed information for each recipe
      const detailedRecipes = await Promise.all(
        recipes.map(async (recipe) => {
          try {
            const detailUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`;
            const detailResponse = await axios.get(detailUrl);
            return {
              ...detailResponse.data,
              matchCount: recipe.usedIngredientCount,
              strMeal: detailResponse.data.title,
              strMealThumb: detailResponse.data.image,
              strCategory: detailResponse.data.dishTypes?.[0] || 'Main Course',
              strArea: detailResponse.data.cuisines?.[0] || 'International',
              strInstructions: detailResponse.data.instructions,
              strYoutube: detailResponse.data.videoUrl,
              // Map ingredients to match our existing format
              ...Array.from({ length: 20 }).reduce((acc, _, i) => {
                if (i < detailResponse.data.extendedIngredients?.length) {
                  const ing = detailResponse.data.extendedIngredients[i];
                  acc[`strIngredient${i + 1}`] = ing.name;
                  acc[`strMeasure${i + 1}`] = `${ing.amount} ${ing.unit}`;
                }
                return acc;
              }, {})
            };
          } catch (error) {
            console.error('Error fetching recipe details:', error);
            return null;
          }
        })
      );

      const validRecipes = detailedRecipes.filter(recipe => recipe !== null);
      setRecipes(validRecipes);

      if (validRecipes.length === 0) {
        toast.info('No recipes found with those ingredients. Try different combinations');
      } else {
        toast.success(`Found ${validRecipes.length} recipes`);
      }
    } catch (error) {
      console.error('Error searching by ingredients:', error);
      if (error.response?.status === 401) {
        toast.error('API authentication failed. Please check API key configuration.');
      } else if (error.response?.status === 402) {
        toast.error('API quota exceeded. Please try again later.');
      } else if (error.message.includes('Network Error')) {
        toast.error('Unable to connect to recipe service. Please try again later');
      } else {
        toast.error('Something went wrong. Please try again');
      }
    }
    setLoading(false);
  };

  const getRecipeDetails = async (id) => {
    try {
      const detailUrl = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`;
      const detailResponse = await axios.get(detailUrl);
      
      const recipe = {
        ...detailResponse.data,
        strMeal: detailResponse.data.title,
        strMealThumb: detailResponse.data.image,
        strCategory: detailResponse.data.dishTypes?.[0] || 'Main Course',
        strArea: detailResponse.data.cuisines?.[0] || 'International',
        strInstructions: detailResponse.data.instructions,
        strYoutube: detailResponse.data.videoUrl,
        // Map ingredients to match our existing format
        ...Array.from({ length: 20 }).reduce((acc, _, i) => {
          if (i < detailResponse.data.extendedIngredients?.length) {
            const ing = detailResponse.data.extendedIngredients[i];
            acc[`strIngredient${i + 1}`] = ing.name;
            acc[`strMeasure${i + 1}`] = `${ing.amount} ${ing.unit}`;
          }
          return acc;
        }, {})
      };
      
      setSelectedRecipe(recipe);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      if (error.response?.status === 402) {
        toast.error('API quota exceeded. Please try again later.');
      } else {
        toast.error('Failed to load recipe details');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      searchByIngredients();
    }
  };

  const handleTextareaResize = (e) => {
    const textarea = e.target;
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    // Set new height based on scrollHeight, with min and max constraints
    const newHeight = Math.min(Math.max(textarea.scrollHeight, windowWidth <= 768 ? 120 : 100), 200);
    textarea.style.height = `${newHeight}px`;
    setTextareaHeight(`${newHeight}px`);
  };

  const RecipeCard = ({ recipe }) => (
    <div
      onClick={() => getRecipeDetails(recipe.idMeal)}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
    >
      <img 
        src={recipe.strMealThumb} 
        alt={recipe.strMeal}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover'
        }}
      />

      {/* Match indicator */}
      {recipe.matchCount && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#e67e22',
            color: 'white',
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(230, 126, 34, 0.3)'
          }}
        >
          {recipe.matchCount} match{recipe.matchCount > 1 ? 'es' : ''}
        </div>
      )}

      <div style={{ 
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
      }}>
        <h3 style={{ 
          margin: '0 0 0.8rem 0', 
          color: '#333',
          fontSize: '1.2rem',
          fontWeight: '600',
          lineHeight: '1.3'
        }}>{recipe.strMeal}</h3>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '1rem',
          color: '#666',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FaUtensils style={{ color: '#e67e22' }} />
            <span>{recipe.strCategory}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FaGlobeAmericas style={{ color: '#e67e22' }} />
            <span>{recipe.strArea}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const RecipeModal = ({ recipe, onClose }) => {
    if (!recipe) return null;

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }

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
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: 'clamp(12px, 3vw, 16px)',
            padding: 'clamp(1rem, 4vw, 2rem)',
            maxWidth: '900px',
            width: '95%',
            maxHeight: '95vh',
            overflow: 'auto',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(230, 126, 34, 0.1)',
              color: '#e67e22',
              border: '1px solid rgba(230, 126, 34, 0.3)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)'
            }}
          >
            <FaTimes />
          </button>
          
          <div style={{ 
            display: 'flex', 
            gap: 'clamp(1rem, 4vw, 2rem)', 
            flexWrap: 'wrap',
            maxHeight: 'calc(95vh - clamp(2rem, 8vw, 4rem))',
            overflow: 'auto'
          }}>
            <div style={{ 
              flex: '1', 
              minWidth: 'min(100%, 300px)',
              maxHeight: '100%'
            }}>
              <img 
                src={recipe.strMealThumb} 
                alt={recipe.strMeal}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              
              <h2 
                style={{ 
                  color: '#333',
                  marginBottom: '1rem',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}
              >
                {recipe.strMeal}
              </h2>

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  color: '#666'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaUtensils style={{ color: '#e67e22' }} /> {recipe.strCategory}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaGlobeAmericas style={{ color: '#e67e22' }} /> {recipe.strArea}
                </span>
              </div>
            </div>
            
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h3 
                style={{ 
                  color: '#e67e22', 
                  marginBottom: '1rem', 
                  fontSize: '1.3rem', 
                  fontWeight: '600'
                }}
              >
                Ingredients
              </h3>
              
              <div style={{ marginBottom: '2rem' }}>
                {ingredients.map((ingredient, index) => (
                  <div
                    key={`ingredient-${componentId}-${index}`}
                    style={{
                      padding: '0.6rem 1rem',
                      background: 'rgba(230, 126, 34, 0.1)',
                      marginBottom: '0.5rem',
                      borderRadius: '8px',
                      borderLeft: '3px solid #e67e22',
                      fontSize: '0.9rem'
                    }}
                  >
                    {ingredient}
                  </div>
                ))}
              </div>
              
              <h3 
                style={{ 
                  color: '#e67e22', 
                  marginBottom: '1rem', 
                  fontSize: '1.3rem', 
                  fontWeight: '600'
                }}
              >
                Instructions
              </h3>
              
              <div
                style={{
                  lineHeight: '1.6',
                  color: '#555',
                  background: 'rgba(255, 255, 255, 0.7)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)'
                }}
              >
                {recipe.strInstructions}
              </div>
              
              {recipe.strYoutube && (
                <div style={{ marginTop: '1.5rem' }}>
                  <a 
                    href={recipe.strYoutube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'white',
                      background: 'linear-gradient(45deg, #e67e22, #f39c12)',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '20px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(230, 126, 34, 0.3)',
                      backdropFilter: 'blur(5px)',
                      WebkitBackdropFilter: 'blur(5px)',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    Watch Recipe Video
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: 'clamp(1rem, 4vw, 2rem)',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)'
    }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(2rem, 6vw, 3rem)',
          padding: '0 clamp(0.5rem, 2vw, 1rem)'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '700',
            color: '#333',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Fridge Mate
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Find delicious recipes based on the ingredients you already have
          </p>
        </div>

        {/* Input Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: 'clamp(12px, 3vw, 16px)',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          marginBottom: 'clamp(2rem, 6vw, 3rem)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            margin: '0 0 1rem 0',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: '700',
            color: '#e67e22',
            textAlign: 'center'
          }}>
            Add Your Ingredients
          </h2>

          <p style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            List your available ingredients and find recipes you can make right now
          </p>

          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
            gap: 'clamp(0.5rem, 2vw, 1rem)',
            alignItems: window.innerWidth <= 768 ? 'stretch' : 'flex-end',
            width: '100%'
          }}>
            <div style={{ 
              flex: 1, 
              width: '100%',
              minWidth: window.innerWidth <= 768 ? '100%' : 'min(100%, 300px)'
            }}>
              <textarea
                value={availableIngredients}
                onChange={(e) => setAvailableIngredients(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={window.innerWidth <= 768 
                  ? "Enter ingredients (e.g., chicken, tomatoes...)" 
                  : "Enter your ingredients separated by commas... (e.g., chicken, tomatoes, garlic, onions, rice)"}
                style={{
                  width: '100%',
                  padding: 'clamp(1rem, 3vw, 1.5rem)',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  border: '1px solid rgba(230, 126, 34, 0.3)',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  resize: 'none',
                  height: textareaHeight,
                  fontFamily: 'inherit',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e67e22';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 126, 34, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(230, 126, 34, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
                onInput={handleTextareaResize}
              />
            </div>
            
            <button
              onClick={searchByIngredients}
              disabled={loading}
              style={{
                background: loading 
                  ? 'rgba(149, 165, 166, 0.8)' 
                  : 'linear-gradient(45deg, #e67e22, #f39c12)',
                color: 'white',
                border: 'none',
                padding: window.innerWidth <= 768 ? '1rem 1.5rem' : '1.5rem 2rem',
                borderRadius: 'clamp(8px, 2vw, 12px)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start',
                gap: '0.8rem',
                width: window.innerWidth <= 768 ? '100%' : 'auto',
                height: 'fit-content',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(230, 126, 34, 0.3)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
                transition: 'all 0.3s ease'
              }}
            >
              <FaSearch />
              {loading ? 'Searching...' : 'Find Recipes'}
            </button>
          </div>
        </div>



        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ fontSize: '3rem', marginBottom: '1rem' }}
          >
            <FaSearch />
          </motion.div>
            <h3 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Searching for recipes...
            </h3>
            <p style={{ color: '#666', fontSize: '1rem' }}>
              Finding delicious recipes with your ingredients
            </p>
          </div>
        )}
        
        {/* Results */}
        {!loading && recipes.length > 0 && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '3rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#333'
              }}              >
                Found {recipes.length} Recipe{recipes.length > 1 ? 's' : ''}
              </h2>
              <p style={{
                color: '#666',
                fontSize: '1rem',
                margin: 0
              }}>
                Click any recipe to see the full details and instructions
              </p>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(1rem, 4vw, 2rem)',
              width: '100%'
            }}>
              {recipes.map((recipe, index) => (
                <div key={generateUniqueRecipeKey(recipe, index, `fridgemate-${componentId}`)}>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && recipes.length === 0 && availableIngredients.trim() && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤔</div>
            <h3 style={{ 
              color: '#333', 
              fontSize: '1.5rem', 
              marginBottom: '1rem'
            }}>
              No recipes found
            </h3>
            <p style={{ 
              color: '#666', 
              fontSize: '1rem', 
              marginBottom: '1rem'
            }}>
              We couldn't find any recipes with those ingredients. 
              Try different combinations or check your spelling
            </p>
            <p style={{ 
              color: '#e67e22', 
              fontSize: '0.9rem', 
              fontWeight: '500'
            }}>
              Try: chicken, rice, tomatoes, onions, garlic, pasta, cheese, eggs, or any common ingredients
            </p>
          </div>
        )}

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

export default FridgeMate;
