import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import RecipeCard from './RecipeCard';
import { FaSpinner, FaUtensils } from 'react-icons/fa';

// PHASE 3: Virtualized grid - only renders visible items
const VirtualizedRecipeGrid = React.memo(({ 
  recipeIds,
  recipesById,
  loading, 
  onSelectRecipe, 
  onDeleteRecipe, 
  onRateRecipe,
  newRecipeIds,
  onLoadMore,
  hasMore
}) => {

  // IMPORTANT: All hooks must be called before any early returns
  // Footer component for loading more
  const Footer = useCallback(() => {
    if (!hasMore) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          You've reached the end of the recipes list
        </div>
      );
    }
    
    if (loading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          gap: '1rem'
        }}>
          <FaSpinner className="animate-spin" size={30} color="#e67e22" />
          <span style={{ color: '#666' }}>Loading more recipes...</span>
        </div>
      );
    }
    
    return null;
  }, [hasMore, loading]);

  // Item renderer with priority for first items (LCP optimization)
  const recipesByIdRef = useRef(recipesById);
  useEffect(() => { recipesByIdRef.current = recipesById; }, [recipesById]);

  const itemContent = useCallback((index, recipeId) => {
    const recipe = recipesByIdRef.current[recipeId];
    if (!recipe) {
      console.warn('[VirtualizedRecipeGrid] Recipe not found:', recipeId);
      return null;
    }

    // LCP: First 6 items get priority loading
    const isPriority = index < 6;

    return (
      <div style={{ 
        padding: '1rem',
        boxSizing: 'border-box'
      }}>
        <RecipeCard
          recipe={recipe}
          onSelect={onSelectRecipe}
          onDelete={onDeleteRecipe}
          onRate={onRateRecipe}
          isPriority={isPriority}
        />
      </div>
    );
  }, [onSelectRecipe, onDeleteRecipe, onRateRecipe]);

  const componentsConfig = useMemo(() => ({ Footer }), [Footer]);

  // Early returns AFTER all hooks
  // Empty state
  if (!loading && recipeIds.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: '2rem 0'
      }}>
        <FaUtensils size={40} style={{ color: '#95a5a6', marginBottom: '20px' }} />
        <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>No recipes found</h2>
        <p style={{ color: '#7f8c8d' }}>
          Try adjusting your filters or add some recipes
        </p>
      </div>
    );
  }

  // Loading state (initial)
  if (loading && recipeIds.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <FaSpinner className="animate-spin" size={40} color="#e67e22" />
      </div>
    );
  }

  return (
    <Virtuoso
      style={{ 
        height: '100vh',
        width: '100%'
      }}
      data={recipeIds}
      endReached={onLoadMore}
      overscan={200}
      itemContent={itemContent}
      components={componentsConfig}
      useWindowScroll
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  const shouldNotUpdate = (
    prevProps.recipeIds === nextProps.recipeIds &&
    prevProps.recipesById === nextProps.recipesById &&
    prevProps.loading === nextProps.loading &&
    prevProps.hasMore === nextProps.hasMore &&
    prevProps.newRecipeIds === nextProps.newRecipeIds
  );
  
  if (!shouldNotUpdate) {
    console.log('[VirtualizedRecipeGrid] RE-RENDERING because:', {
      recipeIdsChanged: prevProps.recipeIds !== nextProps.recipeIds,
      recipesByIdChanged: prevProps.recipesById !== nextProps.recipesById,
      loadingChanged: prevProps.loading !== nextProps.loading,
      hasMoreChanged: prevProps.hasMore !== nextProps.hasMore,
      newRecipeIdsChanged: prevProps.newRecipeIds !== nextProps.newRecipeIds
    });
  }
  
  return shouldNotUpdate;
});

VirtualizedRecipeGrid.displayName = 'VirtualizedRecipeGrid';

export default VirtualizedRecipeGrid;
