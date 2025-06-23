import { useState, useId } from 'react';
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

  const searchByIngredients = async () => {
    if (!availableIngredients.trim()) {
      toast.error('Please add some ingredients to search for recipes');
      return;
    }

    setLoading(true);
    
    try {
      // Split ingredients by comma and clean them up
      const ingredients = availableIngredients
        .split(',')
        .map(ingredient => ingredient.trim().toLowerCase())
        .filter(ingredient => ingredient.length > 0);

      if (ingredients.length === 0) {
        toast.error('Please enter valid ingredients');
        setLoading(false);
        return;
      }

      // Search for recipes by the first ingredient
      const mainIngredient = ingredients[0];
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`);
      let meals = response.data.meals || [];

      if (meals.length === 0) {
        // If no recipes found with first ingredient, try searching as a regular search
        const searchResponse = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mainIngredient}`);
        meals = searchResponse.data.meals || [];
      }

      // If we have multiple ingredients, filter recipes to prefer those with more matching ingredients
      if (ingredients.length > 1 && meals.length > 0) {
        // Get full recipe details to check ingredients
        const detailedRecipes = await Promise.all(
          meals.slice(0, 20).map(async (meal) => { // Limit to first 20 for performance
            try {
              const detailResponse = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
              return detailResponse.data.meals[0];
            } catch (error) {
              console.error('Error fetching recipe details:', error);
              return meal;
            }
          })
        );

        // Score recipes based on ingredient matches
        const scoredRecipes = detailedRecipes.map(recipe => {
          let matchCount = 0;
          const recipeIngredients = [];
          
          // Extract all ingredients from the recipe
          for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            if (ingredient && ingredient.trim()) {
              recipeIngredients.push(ingredient.toLowerCase());
            }
          }

          // Count matches with user's ingredients
          ingredients.forEach(userIngredient => {
            if (recipeIngredients.some(recipeIng => 
              recipeIng.includes(userIngredient) || userIngredient.includes(recipeIng)
            )) {
              matchCount++;
            }
          });

          return { ...recipe, matchCount };
        });

        // Sort by match count (highest first) and take top recipes
        meals = scoredRecipes
          .sort((a, b) => b.matchCount - a.matchCount)
          .slice(0, 12);
      }

      // Remove duplicates based on idMeal
      const uniqueMeals = [];
      const seenIds = new Set();
      
      for (const meal of meals) {
        if (!seenIds.has(meal.idMeal)) {
          seenIds.add(meal.idMeal);
          uniqueMeals.push(meal);
        }
      }

      setRecipes(uniqueMeals);

      if (uniqueMeals.length === 0) {
        toast.info('No recipes found with those ingredients. Try different combinations');
      } else {
        toast.success(`Found ${uniqueMeals.length} recipes`);
      }
    } catch (error) {
      console.error('Error searching by ingredients:', error);
      toast.error('Something went wrong. Please try again');
    }
    setLoading(false);
  };

  const getRecipeDetails = async (id) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      setSelectedRecipe(response.data.meals[0]);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      searchByIngredients();
    }
  };

  const RecipeCard = ({ recipe }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
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
        position: 'relative'
      }}
    >
      <motion.img 
        src={recipe.strMealThumb} 
        alt={recipe.strMeal}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover'
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
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
    </motion.div>
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
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '900px',
            width: '90%',
            maxHeight: '90vh',
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
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
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
      padding: '2rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)'
    }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}
      >
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
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '2.5rem',
          marginBottom: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-end',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.8rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#e67e22'
            }}>
              Your Ingredients
            </label>
            <textarea
              value={availableIngredients}
              onChange={(e) => setAvailableIngredients(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your ingredients separated by commas (e.g., chicken, tomatoes, garlic, onions, rice)"
              style={{
                width: '100%',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(230, 126, 34, 0.3)',
                fontSize: '1rem',
                resize: 'vertical',
                minHeight: '100px',
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
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={searchByIngredients}
            disabled={loading}
            style={{
              background: loading 
                ? 'rgba(149, 165, 166, 0.8)' 
                : 'linear-gradient(45deg, #e67e22, #f39c12)',
              color: 'white',
              border: 'none',
              padding: '1.5rem 2rem',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              height: 'fit-content',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(230, 126, 34, 0.3)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              transition: 'all 0.3s ease'
            }}
          >
            <FaSearch />
            {loading ? 'Searching...' : 'Find Recipes'}
          </motion.button>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
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
        </motion.div>
      )}
      
      {/* Results */}
      {!loading && recipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
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
            }}>
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <AnimatePresence>
              {recipes.map((recipe, index) => (
                <motion.div
                  key={generateUniqueRecipeKey(recipe, index, `fridgemate-${componentId}`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* No Results */}
      {!loading && recipes.length === 0 && availableIngredients.trim() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
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
        </motion.div>
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
