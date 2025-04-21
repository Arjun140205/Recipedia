// src/components/RecipeCard.jsx

import React from 'react';
import PropTypes from 'prop-types';

const RecipeCard = ({ recipe }) => {
    return (
    <div className="recipe-card">
      <div className="recipe-image" style={{ position: 'relative' }}>
        <img src={recipe.strMealThumb || recipe.image} alt={recipe.strMeal || recipe.title} />
      </div>
      <div className="recipe-details">
        <h3>{recipe.strMeal || recipe.title}</h3>
        <p>{recipe.description}</p>
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
