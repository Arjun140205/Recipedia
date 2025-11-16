import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import React from 'react';
import DOMPurify from 'dompurify';
import { createRecipe, getRecipes, deleteRecipe, updateRecipe } from '../services/recipeService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaTimes,
  FaUtensils,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaSort,
  FaSave,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaFire,
  FaClock,
  FaShare,
  FaPrint,
  FaList,
  FaChartLine,
  FaCircle,
  FaUser,
  FaPlay
} from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import EnhancedShare from '../component/EnhancedShare';
import CreatorProfileEdit from '../component/CreatorProfileEdit';
import '../styles/dashboard.css';

const RECIPE_CATEGORIES = {
  meals: {
    label: 'Meals',
    options: [
      { value: 'breakfast', label: 'Breakfast' },
      { value: 'lunch', label: 'Lunch' },
      { value: 'dinner', label: 'Dinner' },
      { value: 'brunch', label: 'Brunch' }
    ]
  },
  courses: {
    label: 'Courses',
    options: [
      { value: 'appetizer', label: 'Appetizer' },
      { value: 'main-course', label: 'Main Course' },
      { value: 'side-dish', label: 'Side Dish' },
      { value: 'soup', label: 'Soup' },
      { value: 'salad', label: 'Salad' }
    ]
  },
  desserts: {
    label: 'Desserts & Snacks',
    options: [
      { value: 'dessert', label: 'Dessert' },
      { value: 'snack', label: 'Snack' },
      { value: 'baked-goods', label: 'Baked Goods' },
      { value: 'ice-cream', label: 'Ice Cream' }
    ]
  },
  dietary: {
    label: 'Dietary',
    options: [
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'gluten-free', label: 'Gluten Free' },
      { value: 'dairy-free', label: 'Dairy Free' }
    ]
  }
};

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular', icon: '⭐' },
  { value: 'recent', label: 'Recently Added', icon: '🕒' },
  { value: 'prepTime', label: 'Quickest to Make', icon: '⏱️' },
  { value: 'title', label: 'Alphabetical', icon: '🔤' }
];

const StarRating = ({ rating, onRate, size = '1.2rem', interactive = false }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <FaStar
          key={i}
          style={{
            color: '#e67e22',
            fontSize: size,
            cursor: interactive ? 'pointer' : 'default'
          }}
          onClick={() => interactive && onRate(i)}
        />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <FaStarHalfAlt
          key={i}
          style={{
            color: '#e67e22',
            fontSize: size,
            cursor: interactive ? 'pointer' : 'default'
          }}
          onClick={() => interactive && onRate(i - 0.5)}
        />
      );
    } else {
      stars.push(
        <FaRegStar
          key={i}
          style={{
            color: '#e67e22',
            fontSize: size,
            cursor: interactive ? 'pointer' : 'default'
          }}
          onClick={() => interactive && onRate(i)}
        />
      );
    }
  }

  return (
    <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
      {stars}
      {interactive && (
        <span style={{
          marginLeft: '0.5rem',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Memoized RecipeCard to prevent unnecessary re-renders
const RecipeCard = React.memo(({ recipe, onSelect, onDelete, onRate, isNew }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent opening the modal when clicking delete
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      onDelete();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Only animate if it's a new recipe
  const CardWrapper = isNew ? motion.div : 'div';
  const animationProps = isNew ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <CardWrapper
      {...animationProps}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect();
        }
      }}
    >
      {/* Delete button */}
      <button
        onClick={handleDelete}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 2,
          backgroundColor: 'rgba(255, 59, 48, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
      >
        <FaTimes />
      </button>

      <div style={{ position: 'relative', height: '200px' }}>
        <img
          src={imageError ? '/default-recipe-image.jpg' : recipe.image}
          alt={DOMPurify.sanitize(recipe.title)}
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backdropFilter: 'blur(4px)'
        }}>
          <FaClock color="#666" />
          <span>{recipe.prepTime} mins</span>
        </div>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#333' }}>
          {DOMPurify.sanitize(recipe.title)}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{
            backgroundColor: '#f8f9fa',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            {recipe.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FaStar color="#FFD700" />
            <span>{recipe.popularity}</span>
          </div>
        </div>
        <StarRating
          rating={recipe.popularity}
          onRate={(rating) => onRate(rating)}
          interactive={true}
          size="1.2rem"
        />
      </div>
    </CardWrapper>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if these specific props change
  return (
    prevProps.recipe._id === nextProps.recipe._id &&
    prevProps.recipe.title === nextProps.recipe.title &&
    prevProps.recipe.popularity === nextProps.recipe.popularity &&
    prevProps.recipe.image === nextProps.recipe.image &&
    prevProps.isNew === nextProps.isNew
  );
});

// SharePreview component commented out as it's not being used
/* const SharePreview = ({ recipe }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      maxWidth: '300px'
    }}>
      <div style={{ position: 'relative', height: '150px' }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{recipe.title}</h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          <FaClock /> {recipe.prepTime} mins
          <span>•</span>
          <FaStar style={{ color: '#e67e22' }} /> {recipe.popularity?.toFixed(1) || '0.0'}
        </div>
      </div>
    </div>
  );
}; */

const RecipeModal = ({ recipe, onClose, onDelete, onUpdate, onRate, onShare, showQRCode, onQRCodeClose }) => {
  const [activeTab, setActiveTab] = useState('ingredients');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add safety check for recipe
  if (!recipe) {
    return null;
  }

  // handleDelete function commented out as it's not being used
  // const handleDelete = () => {
  //   setShowDeleteConfirm(true);
  // };

  const confirmDelete = () => {
    onDelete();
    onClose();
  };



  // Process ingredients and instructions with safety checks
  const ingredientsList = recipe.ingredients ? recipe.ingredients.split('\n').filter(Boolean) : [];
  const instructionsList = recipe.instructions ? recipe.instructions.split('\n').filter(Boolean) : [];

  // Add star rating display
  const StarDisplay = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          color={star <= (recipe.popularity || 0) ? '#FFD700' : '#ddd'}
          size={24}
          style={{ cursor: 'pointer' }}
          onClick={() => onRate(star)}
        />
      ))}
      <span style={{ marginLeft: '0.5rem', fontSize: '1.2rem' }}>
        {(recipe.popularity || 0).toFixed(1)}
      </span>
    </div>
  );

  return (
    <div style={{
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
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1
          }}
        >
          <FaTimes />
        </button>

        <div style={{ position: 'relative', height: '300px' }}>
          <img
            src={recipe.image}
            alt={recipe.title}
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
            padding: '2rem',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            color: 'white'
          }}>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{recipe.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FaClock />
                <span>{recipe.prepTime} mins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FaStar color="#FFD700" />
                <span>{recipe.popularity}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FaFire color="#FF4500" />
                <span>{recipe.category}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Video Section */}
          {recipe.video && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>
                <FaPlay style={{ marginRight: '0.5rem' }} />
                Recipe Video
              </h3>
              <video
                controls
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  backgroundColor: '#000'
                }}
              >
                <source src={recipe.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => onShare(recipe)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaShare /> Share
            </button>
            <button
              onClick={() => window.print()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaPrint /> Print
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setActiveTab('ingredients')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: activeTab === 'ingredients' ? '#e67e22' : '#f8f9fa',
                color: activeTab === 'ingredients' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <FaList /> Ingredients
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: activeTab === 'instructions' ? '#e67e22' : '#f8f9fa',
                color: activeTab === 'instructions' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <FaUtensils /> Instructions
            </button>
            <button
              onClick={() => setActiveTab('popularity')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: activeTab === 'popularity' ? '#e67e22' : '#f8f9fa',
                color: activeTab === 'popularity' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <FaChartLine /> Popularity
            </button>
          </div>

          {activeTab === 'ingredients' && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Ingredients</h3>
              {ingredientsList.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {ingredientsList.map((ingredient, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaCircle size={8} color="#e67e22" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#666' }}>No ingredients available</p>
              )}
            </div>
          )}

          {activeTab === 'instructions' && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Instructions</h3>
              {instructionsList.length > 0 ? (
                <ol style={{ padding: 0, margin: 0, listStylePosition: 'inside' }}>
                  {instructionsList.map((instruction, index) => (
                    <li key={index} style={{ marginBottom: '1rem', color: '#666' }}>
                      {instruction}
                    </li>
                  ))}
                </ol>
              ) : (
                <p style={{ color: '#666' }}>No instructions available</p>
              )}
            </div>
          )}

          {activeTab === 'popularity' && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Rate this Recipe</h3>
              <StarDisplay />
            </div>
          )}
        </div>
      </div>



      {showQRCode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Scan QR Code</h3>
            <QRCodeSVG
              value={window.location.href}
              size={200}
              level="H"
              includeMargin
            />
            <p style={{ margin: '1rem 0 0 0', color: '#666' }}>
              Scan this QR code to view the recipe on your mobile device
            </p>
            <button
              onClick={onQRCodeClose}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1001,
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%'
        }}>
          <h3 style={{ marginTop: 0 }}>Delete Recipe</h3>
          <p>Are you sure you want to delete "{recipe.title}"? This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Add new validation utilities
const validateRecipe = (recipe) => {
  const errors = {};
  if (!recipe.title || recipe.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }
  if (!recipe.ingredients || recipe.ingredients.length < 10) {
    errors.ingredients = 'Ingredients must be at least 10 characters long';
  }
  if (!recipe.instructions || recipe.instructions.length < 10) {
    errors.instructions = 'Instructions must be at least 10 characters long';
  }
  if (!recipe.prepTime || isNaN(recipe.prepTime) || recipe.prepTime < 1) {
    errors.prepTime = 'Preparation time must be a positive number';
  }
  if (!recipe.category) {
    errors.category = 'Category is required';
  }
  return errors;
};

const sanitizeRecipe = (recipe) => {
  return {
    ...recipe,
    title: DOMPurify.sanitize(recipe.title),
    description: DOMPurify.sanitize(recipe.description),
    ingredients: DOMPurify.sanitize(recipe.ingredients),
    instructions: DOMPurify.sanitize(recipe.instructions)
  };
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }
    return this.props.children;
  }
}

// Removed generateUniqueKey - now using stable recipe._id as keys directly

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState({
    fetch: false,
    create: false,
    update: false,
    delete: false
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('recent');
  const [showForm, setShowForm] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showEnhancedShare, setShowEnhancedShare] = useState(false);
  const [shareRecipe, setShareRecipe] = useState(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    category: '',
    image: '',
    video: '',
    tags: '',
    isPublic: true
  });

  // Infinite scroll state
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentPageRef = useRef(1); // Track current page without causing re-renders
  const loadedPagesRef = useRef(new Set([1])); // Use ref to avoid re-renders
  const isLoadingRef = useRef(false); // Track loading state without causing re-renders
  const newRecipeIdsRef = useRef(new Set()); // Track newly added recipe IDs for animation
  const ITEMS_PER_PAGE = 12;

  // Fetch recipes on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      if (isLoadingRef.current) return;
      
      try {
        isLoadingRef.current = true;
        setLoading(prev => ({ ...prev, fetch: true }));

        // Fetch first page of recipes
        const recipesData = await getRecipes(1, ITEMS_PER_PAGE);
        setRecipes(recipesData.recipes);
        setHasMore(recipesData.currentPage < recipesData.totalPages);
        loadedPagesRef.current = new Set([1]);

        // Fetch current user profile
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userResponse = await fetch('https://recipedia-2si5.onrender.com/api/user/profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setCurrentUser(userData);
            }
          } catch (userError) {
            console.error('Error fetching user profile:', userError);
          }
        }
      } catch (error) {
        toast.error('Failed to fetch recipes');
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
        isLoadingRef.current = false;
      }
    };

    fetchInitialData();
  }, []);

  // Infinite scroll: Load more recipes when scrolling near bottom
  const loadMoreRecipes = useCallback(async (pageToLoad) => {
    // Check if already loading or page already loaded
    if (isLoadingRef.current || loadedPagesRef.current.has(pageToLoad)) {
      console.log('Skipping load - already loading or page loaded:', pageToLoad);
      return;
    }

    console.log('Loading page:', pageToLoad);
    
    try {
      isLoadingRef.current = true;
      setLoading(prev => ({ ...prev, fetch: true }));
      
      const recipesData = await getRecipes(pageToLoad, ITEMS_PER_PAGE);
      
      // Append new recipes to existing ones (caching)
      setRecipes(prev => {
        // Filter out any duplicates by ID
        const existingIds = new Set(prev.map(r => r._id));
        const newRecipes = recipesData.recipes.filter(r => !existingIds.has(r._id));
        
        // Mark new recipes for animation
        newRecipes.forEach(r => newRecipeIdsRef.current.add(r._id));
        
        // Clear animation flags after 500ms
        setTimeout(() => {
          newRecipes.forEach(r => newRecipeIdsRef.current.delete(r._id));
        }, 500);
        
        return [...prev, ...newRecipes];
      });
      
      setHasMore(recipesData.currentPage < recipesData.totalPages);
      loadedPagesRef.current.add(pageToLoad);
      
      console.log('Loaded page:', pageToLoad, 'New recipes:', recipesData.recipes.length);
      
    } catch (error) {
      console.error('Error loading more recipes:', error);
      toast.error('Failed to load more recipes');
    } finally {
      setLoading(prev => ({ ...prev, fetch: false }));
      isLoadingRef.current = false;
    }
  }, []);

  // Scroll event handler with throttling
  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Show scroll to top button when scrolled down
      setShowScrollTop(scrollTop > 300);

      // Throttle scroll events
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        
        // Load more when user scrolls to 80% of the page
        if (!isLoadingRef.current && hasMore && scrollTop + clientHeight >= scrollHeight * 0.8) {
          const nextPage = currentPageRef.current + 1;
          // Only trigger load if this page hasn't been loaded yet
          if (!loadedPagesRef.current.has(nextPage)) {
            currentPageRef.current = nextPage;
            loadMoreRecipes(nextPage);
          }
        }
      }, 200); // Throttle to 200ms
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [hasMore, loadMoreRecipes]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Accessibility: Focus management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (showModal || selectedRecipe)) {
        setShowModal(false);
        setSelectedRecipe(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal, selectedRecipe]);



  // Performance optimization: Debounced search
  const debouncedSearch = useCallback((value) => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Validate form data
    const errors = validateRecipe(formData);
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => toast.error(error));
      return;
    }

    try {
      setLoading(prev => ({ ...prev, create: true }));
      const sanitizedData = sanitizeRecipe(formData);

      if (selectedRecipe) {
        // Handle update
        const updatedRecipe = await updateRecipe(selectedRecipe._id, sanitizedData);
        setRecipes(prev => prev.map(recipe =>
          recipe._id === selectedRecipe._id ? updatedRecipe : recipe
        ));
        setSelectedRecipe(null);
        toast.success('Recipe updated successfully');
      } else {
        // Handle creation
        const newRecipe = await createRecipe({
          ...sanitizedData,
          userId: localStorage.getItem('userId')
        });

        // Mark as new for animation
        newRecipeIdsRef.current.add(newRecipe._id);
        
        // Prepend new recipe to the cached list
        setRecipes(prev => [newRecipe, ...prev]);
        
        // Clear animation flag after 500ms
        setTimeout(() => {
          newRecipeIdsRef.current.delete(newRecipe._id);
        }, 500);
        
        toast.success('Recipe created successfully');
      }

      // Reset form
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        prepTime: '',
        category: '',
        image: '',
        video: '',
        tags: '',
        isPublic: true
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error(error.response?.data?.error || 'Failed to save recipe');
    } finally {
      setLoading(prev => ({ ...prev, create: false }));
    }
  }, [formData, selectedRecipe]);

  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handle recipe deletion
  const handleDelete = useCallback(async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        setLoading(prev => ({ ...prev, delete: true }));
        await deleteRecipe(recipeId);
        
        // Remove from cached recipes
        setRecipes(prev => prev.filter(recipe => recipe._id !== recipeId));
        toast.success('Recipe deleted successfully');
      } catch (error) {
        toast.error('Failed to delete recipe');
        console.error('Error deleting recipe:', error);
      } finally {
        setLoading(prev => ({ ...prev, delete: false }));
      }
    }
  }, []);

  // Handle recipe update
  const handleUpdate = useCallback(async (recipeId, updatedData) => {
    try {
      setLoading(prev => ({ ...prev, update: true }));
      const updatedRecipe = await updateRecipe(recipeId, updatedData);
      setRecipes(prev => prev.map(recipe =>
        recipe._id === recipeId ? updatedRecipe : recipe
      ));
      setSelectedRecipe(null);
      toast.success('Recipe updated successfully');
    } catch (error) {
      toast.error('Failed to update recipe');
      console.error('Error updating recipe:', error);
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  }, []);

  // Handle recipe rating
  const handleRateRecipe = useCallback(async (recipeId, rating) => {
    try {
      const updatedRecipe = await updateRecipe(recipeId, { popularity: rating });
      setRecipes(prev => prev.map(recipe =>
        recipe._id === recipeId ? updatedRecipe : recipe
      ));
      toast.success('Rating updated successfully');
    } catch (error) {
      toast.error('Failed to update rating');
      console.error('Error updating rating:', error);
    }
  }, []);

  // Handle image load
  // Using the onLoad property directly in the image element instead
  // of a separate handler for better performance

  // Handle category selection
  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  }, []);

  // Handle sort selection
  const handleSortSelect = useCallback((sort) => {
    setSortOption(sort);
    setShowSortDropdown(false);
  }, []);

  // Add file upload handling
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Add video upload handling
  const handleVideoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for videos
        toast.error('Video size should be less than 50MB');
        return;
      }

      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }

      setFormData(prev => ({
        ...prev,
        video: file
      }));
    }
  }, []);

  // Filter and sort all cached recipes (memoized for performance)
  const displayedRecipes = useMemo(() => {
    console.log('Recalculating displayed recipes. Total cached:', recipes.length);
    
    const filtered = recipes.filter(recipe => {
      const matchesSearch = !searchQuery || recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'popular':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'recent':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'quick':
          return parseInt(a.prepTime || 0) - parseInt(b.prepTime || 0);
        case 'alpha':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    console.log('Displayed recipes after filter/sort:', sorted.length);
    return sorted;
  }, [recipes, searchQuery, selectedCategory, sortOption]);

  // handleIngredientsUpdate and handleFilterChange functions commented out as they're not being used
  /* const handleIngredientsUpdate = async (ingredients) => {
    // setUserIngredients(ingredients); // Commented out since userIngredients is unused
    
    try {
      // Save ingredients to user's pantry
      const response = await fetch('/api/user/pantry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ ingredients })
      });

      if (!response.ok) {
        throw new Error('Failed to update pantry');
      }

      // Find matching recipes
      const matchResponse = await fetch('/api/recipes/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          ingredients: ingredients.map(ing => ing.name),
          filters,
          minMatch: 60
        })
      });

      if (!matchResponse.ok) {
        throw new Error('Failed to find matching recipes');
      }

      const matchedRecipes = await matchResponse.json();
      setRecipes(matchedRecipes);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update ingredients or find matches');
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }; */

  return (
    <ErrorBoundary>
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Recipe Dashboard</h1>
          <p className="dashboard-subtitle">
            Create, manage, and share your delicious recipes with the world!
            {recipes.length > 0 && (
              <span style={{ marginLeft: '1rem', color: '#e67e22', fontWeight: 'bold' }}>
                ({displayedRecipes.length} recipes loaded)
              </span>
            )}
          </p>
        </div>

        <div className="dashboard-content">
          {/* Debug Info Panel - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{
              backgroundColor: '#f0f0f0',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: '#666'
            }}>
              <strong>Debug:</strong> Cached: {recipes.length} | 
              Displayed: {displayedRecipes.length} | 
              Current Page: {currentPageRef.current} |
              Pages Loaded: {Array.from(loadedPagesRef.current).join(', ')} | 
              Loading: {loading.fetch ? 'Yes' : 'No'} | 
              Has More: {hasMore ? 'Yes' : 'No'}
            </div>
          )}

          {/* Search and Actions Section */}
          <div className="search-and-actions">
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => debouncedSearch(e.target.value)}
                placeholder="Search recipes..."
                className="search-input"
                aria-label="Search recipes"
              />
              <FaSearch className="search-icon" />
            </div>

            <div className="button-group">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowProfileEdit(true)}
                className="dashboard-button button-edit-profile"
              >
                <FaUser /> Edit Profile
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                className="dashboard-button button-primary"
              >
                <FaPlus /> Add Recipe
              </motion.button>

              {selectedRecipe && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${selectedRecipe.title}"?`)) {
                      handleDelete(selectedRecipe._id);
                      setSelectedRecipe(null);
                    }
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaTimes /> Delete Selected
                </motion.button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                aria-expanded={showCategoryDropdown}
                aria-controls="category-dropdown"
              >
                <FaFilter /> Filter
              </button>
              {showCategoryDropdown && (
                <div
                  id="category-dropdown"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '1rem',
                    zIndex: 1000,
                    minWidth: '200px'
                  }}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#333' }}>Categories</h3>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                      aria-label="Select category"
                    >
                      <option value="all">All Categories</option>
                      {Object.entries(RECIPE_CATEGORIES).map(([mainCategory, subCategories]) => (
                        <optgroup key={mainCategory} label={subCategories.label}>
                          {subCategories.options.map(category => (
                            <option key={`${mainCategory}-${category.value}`} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => handleCategorySelect('all')}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                aria-expanded={showSortDropdown}
                aria-controls="sort-dropdown"
              >
                <FaSort /> Sort
              </button>
              {showSortDropdown && (
                <div
                  id="sort-dropdown"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '1rem',
                    zIndex: 1000,
                    minWidth: '200px'
                  }}
                >
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSortSelect(option.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: sortOption === option.value ? '#e67e22' : '#f8f9fa',
                        color: sortOption === option.value ? 'white' : '#333',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {loading.fetch && recipes.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <FaSpinner className="animate-spin" size={40} color="#e67e22" />
            </div>
          ) : (
            displayedRecipes.map((recipe) => (
              <div key={recipe._id} style={{ position: 'relative' }}>
                <RecipeCard
                  recipe={recipe}
                  onSelect={() => setSelectedRecipe(recipe)}
                  onDelete={() => handleDelete(recipe._id)}
                  onRate={(rating) => handleRateRecipe(recipe._id, rating)}
                  isNew={newRecipeIdsRef.current.has(recipe._id)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
                      handleDelete(recipe._id);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10,
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                >
                  <FaTimes />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Infinite Scroll Loading Indicator */}
        {loading.fetch && recipes.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            marginTop: '2rem'
          }}>
            <FaSpinner className="animate-spin" size={30} color="#e67e22" />
            <span style={{ marginLeft: '1rem', color: '#666' }}>Loading more recipes...</span>
          </div>
        )}
        
        {/* End of results indicator */}
        {!hasMore && recipes.length > 0 && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            You've reached the end of the recipes list
          </div>
        )}

        {/* Recipe Modal */}
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onDelete={() => handleDelete(selectedRecipe._id)}
            onUpdate={(updatedData) => handleUpdate(selectedRecipe._id, updatedData)}
            onRate={(rating) => handleRateRecipe(selectedRecipe._id, rating)}
            onShare={(recipe) => {
              console.log('Share button clicked for recipe:', recipe);
              console.log('Recipe ID:', recipe._id);
              console.log('Recipe ID type:', typeof recipe._id);
              console.log('Recipe ID length:', recipe._id?.length);

              // Create a clean copy of the recipe to avoid any reference issues
              const cleanRecipe = {
                ...recipe,
                _id: String(recipe._id).trim()
              };

              console.log('Clean recipe ID:', cleanRecipe._id);
              console.log('Clean recipe ID length:', cleanRecipe._id.length);

              setShareRecipe(cleanRecipe);
              setShowEnhancedShare(true);
            }}
            showQRCode={showQRCode}
            onQRCodeClose={() => setShowQRCode(false)}
          />
        )}

        {/* Add/Edit Recipe Form */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>
                {selectedRecipe ? 'Edit Recipe' : 'Add New Recipe'}
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Title Field */}
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                    Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter recipe title"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                {/* Description Field */}
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter recipe description"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Ingredients Field */}
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="ingredients" style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                    Ingredients* (one per line)
                  </label>
                  <textarea
                    id="ingredients"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter ingredients (one per line)"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      minHeight: '150px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Instructions Field */}
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="instructions" style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                    Instructions* (one step per line)
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter cooking instructions (one step per line)"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      minHeight: '150px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Category Field */}
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Select a category</option>
                    {Object.entries(RECIPE_CATEGORIES).map(([group, { label, options }]) => (
                      <optgroup key={group} label={label}>
                        {options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Prep Time Field */}
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="prepTime" style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                    Preparation Time* (minutes)
                  </label>
                  <input
                    type="number"
                    id="prepTime"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="Enter preparation time in minutes"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                {/* Image Upload Field */}
                <div style={{ marginBottom: '2rem' }}>
                  <label htmlFor="image" style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                    Recipe Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  />
                  {formData.image && (
                    <div style={{ marginTop: '1rem' }}>
                      <img
                        src={formData.image}
                        alt="Recipe preview"
                        style={{
                          width: '100%',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Video Upload Field */}
                <div style={{ marginBottom: '2rem' }}>
                  <label htmlFor="video" style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
                    Recipe Video (Optional)
                  </label>
                  <input
                    type="file"
                    id="video"
                    name="video"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem'
                    }}
                  />
                  {formData.video && (
                    <div style={{ marginTop: '1rem' }}>
                      <video
                        controls
                        style={{
                          width: '100%',
                          maxHeight: '300px',
                          borderRadius: '8px'
                        }}
                      >
                        <source src={URL.createObjectURL(formData.video)} type={formData.video.type} />
                        Your browser does not support the video tag.
                      </video>
                      <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                        Video: {formData.video.name} ({(formData.video.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    </div>
                  )}
                  <small style={{ color: '#666' }}>
                    Upload a cooking video or tutorial (Max 50MB, MP4/MOV/AVI formats)
                  </small>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading.create || loading.update}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#e67e22',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      opacity: (loading.create || loading.update) ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {loading.create || loading.update ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {selectedRecipe ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <FaSave />
                        {selectedRecipe ? 'Update Recipe' : 'Create Recipe'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#2c3e50', marginBottom: '1rem' }}>
            Your Recipe Matches
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            padding: '20px 0'
          }}>
            {loading.fetch && recipes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
                <FaSpinner className="spinner" size={40} style={{ color: '#e67e22' }} />
              </div>
            ) : displayedRecipes.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                gridColumn: '1 / -1'
              }}>
                <FaUtensils size={40} style={{ color: '#95a5a6', marginBottom: '20px' }} />
                <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>No matching recipes found</h2>
                <p style={{ color: '#7f8c8d' }}>
                  Try adding more ingredients or adjusting your filters
                </p>
              </div>
            ) : (
              displayedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onSelect={() => setSelectedRecipe(recipe)}
                  onDelete={() => handleDelete(recipe._id)}
                  onRate={(rating) => handleRateRecipe(recipe._id, rating)}
                  isNew={newRecipeIdsRef.current.has(recipe._id)}
                />
              ))
            )}
          </div>


          {/* Enhanced Share Modal */}
          <AnimatePresence>
            {showEnhancedShare && shareRecipe && (
              <EnhancedShare
                key="enhanced-share"
                recipe={shareRecipe}
                onClose={() => {
                  setShowEnhancedShare(false);
                  setShareRecipe(null);
                }}
              />
            )}
          </AnimatePresence>

          {/* Creator Profile Edit Modal */}
          <AnimatePresence>
            {showProfileEdit && currentUser && (
              <CreatorProfileEdit
                key="profile-edit"
                user={currentUser}
                onClose={() => setShowProfileEdit(false)}
                onUpdate={(updatedUser) => {
                  setCurrentUser(updatedUser);
                  setShowProfileEdit(false);
                  toast.success('Profile updated successfully!');
                }}
              />
            )}
          </AnimatePresence>

          {/* Scroll to Top Button */}
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                backgroundColor: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 999,
                fontSize: '1.5rem'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
            >
              ↑
            </motion.button>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
