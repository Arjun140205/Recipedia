import React from 'react';
import { FaSpinner, FaUtensils } from 'react-icons/fa';
import RecipeCard from './RecipeCard';

// PHASE 2: Updated to use normalized data (IDs + byId)
const RecipeGrid = React.memo(({ 
  recipeIds,
  recipesById,
  loading, 
  onSelectRecipe, 
  onDeleteRecipe, 
  onRateRecipe,
  newRecipeIds 
}) => {
  // PHASE 1: Instrumentation - Log renders
  console.log('[RecipeGrid] Rendering with:', {
    recipeIdsCount: recipeIds.length,
    loading,
    newRecipeIdsCount: newRecipeIds.size,
    timestamp: Date.now()
  });

  if (loading && recipeIds.length === 0) {
    return (
      <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
        <FaSpinner className="animate-spin" size={40} color="#e67e22" />
      </div>
    );
  }

  if (recipeIds.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        gridColumn: '1 / -1'
      }}>
        <FaUtensils size={40} style={{ color: '#95a5a6', marginBottom: '20px' }} />
        <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>No recipes found</h2>
        <p style={{ color: '#7f8c8d' }}>
          Try adjusting your filters or add some recipes
        </p>
      </div>
    );
  }

  return (
    <>
      {recipeIds.map((recipeId, index) => {
        const recipe = recipesById[recipeId];
        if (!recipe) return null;
        
        // LCP: First 6 items get priority loading
        const isPriority = index < 6;
        
        return (
          <RecipeCard
            key={recipeId}
            recipe={recipe}
            onSelect={onSelectRecipe}
            onDelete={onDeleteRecipe}
            onRate={onRateRecipe}
            isNew={newRecipeIds.has(recipeId)}
            isPriority={isPriority}
          />
        );
      })}
    </>
  );
}, (prevProps, nextProps) => {
  // PHASE 2: Updated comparison for normalized data
  const shouldNotUpdate = (
    prevProps.recipeIds === nextProps.recipeIds &&
    prevProps.recipesById === nextProps.recipesById &&
    prevProps.loading === nextProps.loading &&
    prevProps.newRecipeIds === nextProps.newRecipeIds
  );
  
  // PHASE 1: Instrumentation - Log why re-rendering
  if (!shouldNotUpdate) {
    console.log('[RecipeGrid] RE-RENDERING because:', {
      recipeIdsChanged: prevProps.recipeIds !== nextProps.recipeIds,
      recipeIdslengthChanged: prevProps.recipeIds.length !== nextProps.recipeIds.length,
      recipesByIdChanged: prevProps.recipesById !== nextProps.recipesById,
      loadingChanged: prevProps.loading !== nextProps.loading,
      newRecipeIdsChanged: prevProps.newRecipeIds !== nextProps.newRecipeIds,
      callbacksChanged: {
        onSelectRecipe: prevProps.onSelectRecipe !== nextProps.onSelectRecipe,
        onDeleteRecipe: prevProps.onDeleteRecipe !== nextProps.onDeleteRecipe,
        onRateRecipe: prevProps.onRateRecipe !== nextProps.onRateRecipe
      }
    });
  }
  
  return shouldNotUpdate;
});

RecipeGrid.displayName = 'RecipeGrid';

export default RecipeGrid;
