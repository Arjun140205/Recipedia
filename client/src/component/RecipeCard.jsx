// src/components/RecipeCard.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

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

  const matchBadgeStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: recipe.matchPercentage >= 90 ? '#27ae60' : 
                    recipe.matchPercentage >= 70 ? '#f39c12' : '#e74c3c',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
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
      {/* Match Percentage Badge */}
      {recipe.matchPercentage !== undefined && (
        <div style={matchBadgeStyle}>
          <FaCheckCircle size={14} />
          {recipe.matchPercentage}% Match
        </div>
      )}

      {/* Delete Button */}
      {showDelete && onDelete && (
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

      <div style={{ padding: '15px' }}>
        <h3 style={{ 
          margin: '0 0 10px 0',
          fontSize: '1.2rem',
          color: '#2c3e50'
        }}>
          {recipe.strMeal || recipe.title}
        </h3>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#7f8c8d',
          fontSize: '0.9rem'
        }}>
          <span>
            {recipe.prepTime} mins
          </span>
          {recipe.difficulty && (
            <span style={{
              textTransform: 'capitalize',
              color: recipe.difficulty === 'easy' ? '#27ae60' :
                     recipe.difficulty === 'medium' ? '#f39c12' : '#e74c3c'
            }}>
              {recipe.difficulty}
            </span>
          )}
        </div>

        {recipe.dietary && (
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginTop: '10px'
          }}>
            {recipe.dietary.vegetarian && (
              <span style={{ 
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                Vegetarian
              </span>
            )}
            {recipe.dietary.vegan && (
              <span style={{ 
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                Vegan
              </span>
            )}
            {recipe.dietary.glutenFree && (
              <span style={{ 
                backgroundColor: '#fff3e0',
                color: '#ef6c00',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                Gluten-Free
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default React.memo(RecipeCard);
