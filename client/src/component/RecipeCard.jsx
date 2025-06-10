// src/components/RecipeCard.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaStar } from 'react-icons/fa';

const RecipeCard = ({ recipe, onSelect, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent opening the modal when clicking delete
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      onDelete();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      className="recipe-card" 
      onClick={() => onSelect(recipe)}
      style={{
        cursor: 'pointer',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        backgroundColor: 'white',
        position: 'relative'
      }}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      {/* Delete Button */}
      {showDelete && (
        <button
          onClick={handleDelete}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 2,
            backgroundColor: 'rgba(220, 53, 69, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 1)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FaTimes />
        </button>
      )}

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
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginTop: '0.5rem',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          <FaStar style={{ color: '#FFD700' }} />
          <span style={{ marginLeft: '0.25rem' }}>
            {recipe.popularity ? recipe.popularity.toFixed(1) : '0.0'}
          </span>
        </div>
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
    description: PropTypes.string,
    popularity: PropTypes.number
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default RecipeCard;
