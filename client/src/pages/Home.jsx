import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaUtensils, FaGlobeAmericas } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef();
  
  const lastRecipeElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        loadMoreRecipes();
      }
    });
    if (node) observer.current.observe(node);
  },// eslint-disable-next-line
   [loading, hasMore, isLoadingMore]);

  const loadMoreRecipes = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`,
        { params: { p: nextPage } }
      );
      const newRecipes = response.data.meals || [];
      if (newRecipes.length === 0) {
        setHasMore(false);
      } else {
        setRecipes(prev => [...prev, ...newRecipes]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more recipes:', error);
    }
    setIsLoadingMore(false);
  };

  useEffect(() => {
    fetchRandomRecipes();
    fetchCategories();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setShowScrollButton(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const searchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      setRecipes(response.data.meals || []);
      setHasMore(true);
      setPage(1);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  const handleCategorySelect = async (category) => {
    setLoading(true);
    setSelectedCategory(category);
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      setRecipes(response.data.meals || []);
      setHasMore(true);
      setPage(1);
    } catch (error) {
      console.error('Error fetching category recipes:', error);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchRecipes();
    }
  };

  const fetchRandomRecipes = async () => {
    setLoading(true);
    try {
      const promises = Array(8).fill().map(() => 
        axios.get('https://www.themealdb.com/api/json/v1/1/random.php')
      );
      const responses = await Promise.all(promises);
      const recipes = responses
        .map(response => response.data.meals?.[0])
        .filter(recipe => recipe); // Remove any null values
      setRecipes(recipes);
      setHasMore(true);
      setPage(1);
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      toast.error('Failed to fetch recipes');
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

  const RecipeCard = ({ recipe }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -10 }}
      onClick={() => getRecipeDetails(recipe.idMeal)}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          src={recipe.strMealThumb} 
          alt={recipe.strMeal}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>
      <div style={{ 
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
      }}>
        <h3 style={{ 
          margin: '0', 
          color: '#333',
          fontSize: '1.2rem',
          fontWeight: '600' 
        }}>{recipe.strMeal}</h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '0.5rem',
          color: '#666'
        }}>
          <FaUtensils size={14} />
          <span>{recipe.strCategory}</span>
          <FaGlobeAmericas size={14} style={{ marginLeft: '0.5rem' }} />
          <span>{recipe.strArea}</span>
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
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
          onClick={e => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '2rem',
              top: '2rem',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <FaTimes />
          </motion.button>

          <img 
            src={recipe.strMealThumb} 
            alt={recipe.strMeal}
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}
          />
          
          <h2 style={{ 
            marginTop: '1rem',
            fontSize: '2rem',
            color: '#333'
          }}>{recipe.strMeal}</h2>
          
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ 
              color: '#444',
              fontSize: '1.4rem',
              marginBottom: '1rem'
            }}>Ingredients:</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {ingredients.map((ingredient, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(230, 126, 34, 0.2)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {ingredient}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ 
              color: '#444',
              fontSize: '1.4rem',
              marginBottom: '1rem'
            }}>Instructions:</h3>
            <p style={{ 
              lineHeight: '1.8',
              color: '#555',
              whiteSpace: 'pre-line'
            }}>{recipe.strInstructions}</p>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{ 
            fontSize: '3rem',
            color: '#333',
            marginBottom: '1rem'
          }}>Discover Amazing Recipes</h1>
          <p style={{ 
            fontSize: '1.2rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>Search from thousands of delicious recipes and start cooking today!</p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              position: 'relative',
              flex: 1 
            }}>
              <FaSearch style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666'
              }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for recipes..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  paddingLeft: '3rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(230, 126, 34, 0.3)',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)'
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={searchRecipes}
              style={{
                backgroundColor: '#e67e22',
                color: 'white',
                border: 'none',
                padding: '0 2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaSearch />
              Search
            </motion.button>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            padding: '0.5rem 0'
          }}>
            {categories.map((category) => (
              <motion.button
                key={category.strCategory}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect(category.strCategory)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(230, 126, 34, 0.3)',
                  background: selectedCategory === category.strCategory 
                    ? '#e67e22' 
                    : 'rgba(255, 255, 255, 0.9)',
                  color: selectedCategory === category.strCategory 
                    ? 'white' 
                    : '#666',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)'
                }}
              >
                {category.strCategory}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem',
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <motion.svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            style={{ margin: '0 auto' }}
          >
            {/* Pot */}
            <motion.path
              d="M20,60 L80,60 Q90,60 90,70 L90,90 Q90,95 85,95 L15,95 Q10,95 10,90 L10,70 Q10,60 20,60"
              fill="#e67e22"
              initial={{ y: 0 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Lid */}
            <motion.path
              d="M15,55 L85,55 Q90,55 90,60 L10,60 Q10,55 15,55"
              fill="#d35400"
              initial={{ rotate: 0 }}
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {/* Steam */}
            <motion.path
              d="M40,45 Q45,35 50,45 Q55,35 60,45"
              fill="none"
              stroke="#95a5a6"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -10 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.svg>
          <p style={{ 
            marginTop: '1.5rem',
            color: '#666',
            fontSize: '1.2rem',
            fontWeight: '500'
          }}>Cooking up some delicious recipes...</p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {recipes.map((recipe, index) => (
              <div
                key={recipe.idMeal}
                ref={index === recipes.length - 1 ? lastRecipeElementRef : null}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {isLoadingMore && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          opacity: 0.7 
        }}>
          Loading more recipes...
        </div>
      )}

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: 'rgba(230, 126, 34, 0.9)',
              color: 'white',
              border: 'none',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              fontSize: '1.5rem'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      <style>
        {`
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
    </div>
  );
};

export default Home;
