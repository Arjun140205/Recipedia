import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { FaStar, FaRegStar, FaStarHalfAlt, FaClock, FaTimes } from 'react-icons/fa';

// Memoized StarRating component
const StarRating = React.memo(({ rating, onRate, size = '1.2rem', interactive = false }) => {
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
});

StarRating.displayName = 'StarRating';

// Memoized RecipeCard - ONLY re-renders when these specific props change
const RecipeCard = React.memo(({ recipe, onSelect, onDelete, onRate, isNew, isPriority = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // PHASE 1: Instrumentation - Log renders
  console.log(`[RecipeCard] Rendering: ${recipe._id}`, { 
    title: recipe.title, 
    isNew,
    timestamp: Date.now()
  });

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
        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        position: 'relative',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
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
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        <FaTimes />
      </button>

      <div style={{ position: 'relative', height: '200px', backgroundColor: '#f0f0f0' }}>
        {!imageLoaded && !imageError && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
        )}
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
          loading={isPriority ? "eager" : "lazy"}
          decoding="async"
          fetchpriority={isPriority ? "high" : "auto"}
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
            <span>{recipe.popularity || 0}</span>
          </div>
        </div>
        <StarRating
          rating={recipe.popularity || 0}
          onRate={onRate}
          interactive={true}
          size="1.2rem"
        />
      </div>
    </CardWrapper>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - ONLY re-render if these specific props change
  const shouldNotUpdate = (
    prevProps.recipe._id === nextProps.recipe._id &&
    prevProps.recipe.title === nextProps.recipe.title &&
    prevProps.recipe.popularity === nextProps.recipe.popularity &&
    prevProps.recipe.image === nextProps.recipe.image &&
    prevProps.recipe.prepTime === nextProps.recipe.prepTime &&
    prevProps.recipe.category === nextProps.recipe.category &&
    prevProps.isNew === nextProps.isNew
  );
  
  // PHASE 1: Instrumentation - Log why re-rendering
  if (!shouldNotUpdate) {
    console.log(`[RecipeCard] RE-RENDERING ${nextProps.recipe._id} because:`, {
      idChanged: prevProps.recipe._id !== nextProps.recipe._id,
      titleChanged: prevProps.recipe.title !== nextProps.recipe.title,
      popularityChanged: prevProps.recipe.popularity !== nextProps.recipe.popularity,
      imageChanged: prevProps.recipe.image !== nextProps.recipe.image,
      prepTimeChanged: prevProps.recipe.prepTime !== nextProps.recipe.prepTime,
      categoryChanged: prevProps.recipe.category !== nextProps.recipe.category,
      isNewChanged: prevProps.isNew !== nextProps.isNew,
      recipeObjectChanged: prevProps.recipe !== nextProps.recipe
    });
  }
  
  return shouldNotUpdate;
});

RecipeCard.displayName = 'RecipeCard';

export default RecipeCard;
