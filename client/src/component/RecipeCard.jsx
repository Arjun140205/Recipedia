// src/components/RecipeCard.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RecipeCard = ({ recipe, onSelect }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      className="recipe-card" 
      onClick={onSelect}
      style={{
        cursor: 'pointer',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
        backgroundColor: 'white',
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div className="recipe-image" style={{ position: 'relative', height: '200px', backgroundColor: '#f0f0f0' }}>
        <img 
          src={imageError ? '/default-recipe-image.jpg' : (recipe.strMealThumb || recipe.image)} 
          alt={recipe.strMeal || recipe.title}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>
      <div className="recipe-details" style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{recipe.strMeal || recipe.title}</h3>
        {recipe.description && (
          <p style={{ 
            margin: 0, 
            color: '#666', 
            fontSize: '0.9rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>{recipe.description}</p>
        )}
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    idMeal: PropTypes.string,
    strMeal: PropTypes.string,
    strMealThumb: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string
  }).isRequired,
};

export default RecipeCard;
