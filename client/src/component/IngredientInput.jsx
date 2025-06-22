import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const IngredientInput = ({ onIngredientsUpdate }) => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [category, setCategory] = useState('other');

  const categories = [
    'produce',
    'dairy',
    'meat',
    'grains',
    'spices',
    'other'
  ];

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const inputGroupStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  };

  const inputStyle = {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem'
  };

  const selectStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fff'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#e67e22',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  };

  const tagStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#f5f6f7',
    padding: '6px 12px',
    borderRadius: '20px',
    margin: '4px',
    fontSize: '0.9rem'
  };

  const tagCloseStyle = {
    marginLeft: '8px',
    cursor: 'pointer',
    color: '#666',
    fontWeight: 'bold'
  };

  const handleAddIngredient = () => {
    if (!newIngredient.trim()) {
      toast.warn('Please enter an ingredient');
      return;
    }

    const newIngredientObj = {
      name: newIngredient.trim().toLowerCase(),
      category
    };

    setIngredients(prev => {
      const updated = [...prev, newIngredientObj];
      onIngredientsUpdate(updated);
      return updated;
    });
    
    setNewIngredient('');
    setCategory('other');
  };

  const handleRemoveIngredient = (indexToRemove) => {
    setIngredients(prev => {
      const updated = prev.filter((_, index) => index !== indexToRemove);
      onIngredientsUpdate(updated);
      return updated;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>What's in your kitchen?</h3>
      
      <div style={inputGroupStyle}>
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter an ingredient..."
          style={inputStyle}
        />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={selectStyle}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleAddIngredient}
          style={buttonStyle}
          onMouseOver={e => e.target.style.backgroundColor = '#d35400'}
          onMouseOut={e => e.target.style.backgroundColor = '#e67e22'}
        >
          Add
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {ingredients.map((ing, index) => (
          <span key={index} style={tagStyle}>
            {ing.name}
            <span 
              style={tagCloseStyle}
              onClick={() => handleRemoveIngredient(index)}
            >
              ×
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default IngredientInput;
