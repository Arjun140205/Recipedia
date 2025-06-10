import { useEffect, useState, useCallback, useMemo } from 'react';
import React from 'react';
import DOMPurify from 'dompurify';
import { createRecipe, getRecipes, deleteRecipe, updateRecipe } from '../services/recipeService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaUtensils, FaSpinner, FaSearch, FaFilter, FaSort, FaSave, FaStar, FaRegStar, FaStarHalfAlt, FaFire, FaClock, FaShare, FaPrint, FaList, FaChartLine, FaFacebook, FaTwitter, FaWhatsapp, FaCopy, FaQrcode, FaCircle } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

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

const RecipeCard = ({ recipe, onSelect, onDelete, onRate }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        position: 'relative' // Added for delete button positioning
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
    </motion.div>
  );
};

const SharePreview = ({ recipe }) => {
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
};

const RecipeModal = ({ recipe, onClose, onDelete, onUpdate, onRate, showQRCode, onQRCodeClose }) => {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add safety check for recipe
  if (!recipe) {
    return null;
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete();
    onClose();
  };

  // Share options with their actions
  const shareOptions = [
    {
      name: 'Copy Link',
      icon: <FaCopy />,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    },
    {
      name: 'Facebook',
      icon: <FaFacebook />,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      action: () => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank')
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp />,
      action: () => window.open(`https://api.whatsapp.com/send?text=${window.location.href}`, '_blank')
    },
    {
      name: 'QR Code',
      icon: <FaQrcode />,
      action: () => onQRCodeClose()
    }
  ];

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
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
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

      {showShareOptions && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '1rem',
          zIndex: 1001
        }}>
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={() => {
                option.action();
                setShowShareOptions(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#333',
                textAlign: 'left'
              }}
            >
              {option.icon}
              {option.name}
            </button>
          ))}
        </div>
      )}

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

const Dashboard = () => {
  // State management
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState({
    fetch: false,
    create: false,
    update: false,
    delete: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showForm, setShowForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    category: '',
    image: ''
  });

  // Fetch recipes on component mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(prev => ({ ...prev, fetch: true }));
        const data = await getRecipes();
        setRecipes(data);
      } catch (error) {
        toast.error('Failed to fetch recipes');
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };

    fetchRecipes();
  }, []);

  // Accessibility: Focus management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (showForm || selectedRecipe)) {
        setShowForm(false);
        setSelectedRecipe(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showForm, selectedRecipe]);

  // Performance optimization: Memoize filtered and sorted recipes
  const filteredAndSortedRecipes = useMemo(() => {
    return recipes
      .filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'popular':
            return b.popularity - a.popularity;
          case 'recent':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'quick':
            return parseInt(a.prepTime) - parseInt(b.prepTime);
          case 'alpha':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [recipes, searchQuery, selectedCategory, sortBy]);

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
        
        setRecipes(prev => [newRecipe, ...prev]);
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
        image: ''
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
    setSortBy(sort);
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

  // Add pagination
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const paginatedRecipes = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedRecipes, page]);

  return (
    <ErrorBoundary>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Search and Filter Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem' 
          }}>
            <div style={{ flex: 1, position: 'relative', marginRight: '1rem' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => debouncedSearch(e.target.value)}
                placeholder="Search recipes..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
                aria-label="Search recipes"
              />
              <FaSearch style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666'
              }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#e67e22',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
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
                        <optgroup key={mainCategory} label={mainCategory}>
                          {subCategories.map(category => (
                            <option key={category} value={category}>
                              {category}
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
                        backgroundColor: sortBy === option.value ? '#e67e22' : '#f8f9fa',
                        color: sortBy === option.value ? 'white' : '#333',
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
          {loading.fetch ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <FaSpinner className="animate-spin" size={40} color="#e67e22" />
            </div>
          ) : (
            <AnimatePresence>
              {paginatedRecipes.map(recipe => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ position: 'relative' }}
                >
                  <RecipeCard
                    recipe={recipe}
                    onSelect={() => setSelectedRecipe(recipe)}
                    onDelete={() => handleDelete(recipe._id)}
                    onRate={(rating) => handleRateRecipe(recipe._id, rating)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
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
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    <FaTimes />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredAndSortedRecipes.length > ITEMS_PER_PAGE && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem', 
            marginTop: '2rem',
            alignItems: 'center' 
          }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                opacity: page === 1 ? 0.5 : 1
              }}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span>Page {page} of {Math.ceil(filteredAndSortedRecipes.length / ITEMS_PER_PAGE)}</span>
            <button
              onClick={() => setPage(p => Math.min(Math.ceil(filteredAndSortedRecipes.length / ITEMS_PER_PAGE), p + 1))}
              disabled={page >= Math.ceil(filteredAndSortedRecipes.length / ITEMS_PER_PAGE)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: page >= Math.ceil(filteredAndSortedRecipes.length / ITEMS_PER_PAGE) ? 'not-allowed' : 'pointer',
                opacity: page >= Math.ceil(filteredAndSortedRecipes.length / ITEMS_PER_PAGE) ? 0.5 : 1
              }}
              aria-label="Next page"
            >
              Next
            </button>
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

        {/* ...rest of the existing dashboard code... */}
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
