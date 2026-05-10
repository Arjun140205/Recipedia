import { useState, useEffect, useRef, useCallback } from 'react';
import { getRecipes } from '../services/recipeService';
import { toast } from 'react-toastify';

// Custom hook for infinite scroll logic - ISOLATED from UI components
export const useInfiniteScroll = (itemsPerPage = 12) => {
  // PHASE 2: Normalized data structure
  // Instead of array of recipes, use { byId: {}, allIds: [] }
  // This preserves object identity for unchanged recipes
  const [recipeState, setRecipeState] = useState({
    byId: {},      // { '123': { _id: '123', title: '...' }, ... }
    allIds: []     // ['123', '456', '789', ...]
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Track initial load
  const [hasMore, setHasMore] = useState(true);
  // FIX: newRecipeIds as state so memo comparators get a stable, versioned Set
  const [newRecipeIds, setNewRecipeIds] = useState(() => new Set());
  
  // Use refs to avoid re-renders
  const currentPageRef = useRef(1);
  const loadedPagesRef = useRef(new Set([1]));
  const isLoadingRef = useRef(false);
  const newRecipeIdsRef = useRef(new Set());

  // Fetch initial recipes - optimized for LCP
  useEffect(() => {
    const fetchInitialData = async () => {
      if (isLoadingRef.current) return;
      
      try {
        isLoadingRef.current = true;
        setLoading(true);
        setInitialLoading(true);

        // LCP OPTIMIZATION: Fetch only 6 recipes initially (above-the-fold)
        // This reduces initial load time and improves LCP
        const initialBatchSize = 6;
        const recipesData = await getRecipes(1, initialBatchSize);
        
        // PHASE 2: Normalize recipes into byId and allIds
        const byId = {};
        const allIds = [];
        
        recipesData.recipes.forEach(recipe => {
          byId[recipe._id] = recipe;
          allIds.push(recipe._id);
        });
        
        setRecipeState({ byId, allIds });
        setHasMore(recipesData.currentPage < recipesData.totalPages);
        
        // Mark first page as loaded
        loadedPagesRef.current.add(1);
        currentPageRef.current = 1;
        
        console.log('[useInfiniteScroll] Initial load normalized (LCP optimized):', {
          recipesCount: allIds.length,
          pagesLoaded: Array.from(loadedPagesRef.current),
          sampleIds: allIds.slice(0, 3)
        });

        // LCP OPTIMIZATION: Immediately fetch next batch in background
        // This provides smooth UX without blocking initial render
        setTimeout(async () => {
          try {
            const nextBatchSize = 24; // Fetch 24 more (total 30)
            const nextRecipesData = await getRecipes(2, nextBatchSize);
            
            setRecipeState((prevState) => {
              // FIX: Only create new objects if recipes actually changed.
              // Returning prevState preserves object identity → RecipeGrid won't re-render.
              let changed = false;
              const newById = { ...prevState.byId };
              const newAllIds = [...prevState.allIds];
              
              nextRecipesData.recipes.forEach(recipe => {
                if (!newById[recipe._id]) {
                  newById[recipe._id] = recipe;
                  newAllIds.push(recipe._id);
                  changed = true;
                }
              });
              
              if (!changed) return prevState;
              return { byId: newById, allIds: newAllIds };
            });
            
            setHasMore(nextRecipesData.currentPage < nextRecipesData.totalPages);
            loadedPagesRef.current.add(2);
            currentPageRef.current = 2;
          } catch (error) {
            console.error('Error loading background batch:', error);
          }
        }, 100); // Small delay to prioritize initial render
        
      } catch (error) {
        toast.error('Failed to fetch recipes');
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        isLoadingRef.current = false;
      }
    };

    fetchInitialData();
  }, [itemsPerPage]);

  // PHASE 2.2: Load more recipes - stable reference (no changing dependencies)
  const loadMoreRecipes = useCallback(async (pageToLoad) => {
    if (isLoadingRef.current || loadedPagesRef.current.has(pageToLoad)) {
      console.log('[useInfiniteScroll] Skipping load - already loading or page loaded:', pageToLoad);
      return;
    }

    // Use functional state update to avoid dependency on recipeState
    console.log('[useInfiniteScroll] Loading page:', pageToLoad, {
      loadedPages: Array.from(loadedPagesRef.current)
    });
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      
      const recipesData = await getRecipes(pageToLoad, itemsPerPage);
      
      // FIX: Use functional update with normalized structure + change guard
      setRecipeState((prevState) => {
        let changed = false;
        const newById = { ...prevState.byId };
        const newAllIds = [...prevState.allIds];
        const addedIds = [];
        
        recipesData.recipes.forEach(recipe => {
          // Only add if not already present
          if (!newById[recipe._id]) {
            newById[recipe._id] = recipe; // Preserve object identity
            newAllIds.push(recipe._id);
            addedIds.push(recipe._id);
            changed = true;
          }
        });
        
        if (!changed) return prevState; // Return same reference → no re-render
        
        // Mark new recipes for animation via state
        if (addedIds.length > 0) {
          addedIds.forEach(id => newRecipeIdsRef.current.add(id));
          setNewRecipeIds(new Set(newRecipeIdsRef.current));
          setTimeout(() => {
            addedIds.forEach(id => newRecipeIdsRef.current.delete(id));
            setNewRecipeIds(new Set(newRecipeIdsRef.current));
          }, 500);
        }
        
        return { byId: newById, allIds: newAllIds };
      });
      
      setHasMore(recipesData.currentPage < recipesData.totalPages);
      loadedPagesRef.current.add(pageToLoad);
      
    } catch (error) {
      console.error('Error loading more recipes:', error);
      toast.error('Failed to load more recipes');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [itemsPerPage]); // PHASE 2.2: Removed recipeState dependency - using functional updates

  // Scroll handler - throttled and optimized
  useEffect(() => {
    let scrollTimeout;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Throttle scroll events
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        
        // Load more when user scrolls to 80% of the page
        if (!isLoadingRef.current && hasMore && scrollTop + clientHeight >= scrollHeight * 0.8) {
          const nextPage = currentPageRef.current + 1;
          if (!loadedPagesRef.current.has(nextPage)) {
            currentPageRef.current = nextPage;
            loadMoreRecipes(nextPage);
          }
        }
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [hasMore, loadMoreRecipes]);

  // Add recipe to cache
  const addRecipe = useCallback((newRecipe) => {
    newRecipeIdsRef.current.add(newRecipe._id);
    setNewRecipeIds(new Set(newRecipeIdsRef.current));
    
    // PHASE 2: Update normalized structure
    setRecipeState((prev) => ({
      byId: { [newRecipe._id]: newRecipe, ...prev.byId },
      allIds: [newRecipe._id, ...prev.allIds]
    }));
    
    setTimeout(() => {
      newRecipeIdsRef.current.delete(newRecipe._id);
      setNewRecipeIds(new Set(newRecipeIdsRef.current));
    }, 500);
  }, []);

  // Update recipe in cache
  const updateRecipe = useCallback((recipeId, updatedRecipe) => {
    // PHASE 2: Update in normalized structure
    setRecipeState((prev) => ({
      byId: {
        ...prev.byId,
        [recipeId]: updatedRecipe
      },
      allIds: prev.allIds // IDs don't change
    }));
  }, []);

  // Delete recipe from cache
  const deleteRecipe = useCallback((recipeId) => {
    // PHASE 2: Remove from normalized structure
    setRecipeState((prev) => {
      const newById = { ...prev.byId };
      delete newById[recipeId];
      
      return {
        byId: newById,
        allIds: prev.allIds.filter(id => id !== recipeId)
      };
    });
  }, []);

  // PHASE 3: Expose loadMore for virtualization
  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingRef.current) return;
    
    const nextPage = currentPageRef.current + 1;
    if (!loadedPagesRef.current.has(nextPage)) {
      currentPageRef.current = nextPage;
      loadMoreRecipes(nextPage);
    }
  }, [hasMore, loadMoreRecipes]);

  return {
    // PHASE 2: Return normalized data
    recipesById: recipeState.byId,
    recipeIds: recipeState.allIds,
    loading,
    initialLoading, // NEW: Track initial load state
    hasMore,
    newRecipeIds, // FIX: React state-based Set for stable memo comparisons
    loadedPages: loadedPagesRef.current,
    currentPage: currentPageRef.current,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    loadMore // PHASE 3: For virtualization
  };
};
