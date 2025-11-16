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
              const newById = { ...prevState.byId };
              const newAllIds = [...prevState.allIds];
              
              nextRecipesData.recipes.forEach(recipe => {
                if (!newById[recipe._id]) {
                  newById[recipe._id] = recipe;
                  newAllIds.push(recipe._id);
                }
              });
              
              return { byId: newById, allIds: newAllIds };
            });
            
            setHasMore(nextRecipesData.currentPage < nextRecipesData.totalPages);
            loadedPagesRef.current.add(2);
            currentPageRef.current = 2;
            
            console.log('[useInfiniteScroll] Background batch loaded:', {
              totalRecipes: allIds.length + nextRecipesData.recipes.length
            });
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
      
      // PHASE 2: Use functional update with normalized structure
      setRecipeState((prevState) => {
        const newById = { ...prevState.byId };
        const newAllIds = [...prevState.allIds];
        
        recipesData.recipes.forEach(recipe => {
          // Only add if not already present
          if (!newById[recipe._id]) {
            newById[recipe._id] = recipe; // Preserve object identity
            newAllIds.push(recipe._id);
            
            // Mark new recipes for animation
            newRecipeIdsRef.current.add(recipe._id);
          }
        });
        
        // Clear animation flags after 500ms
        setTimeout(() => {
          recipesData.recipes.forEach(r => {
            newRecipeIdsRef.current.delete(r._id);
          });
        }, 500);
        
        console.log('[useInfiniteScroll] Added recipes:', {
          newCount: recipesData.recipes.length,
          totalCount: newAllIds.length
        });
        
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
    
    // PHASE 2: Update normalized structure
    setRecipeState((prev) => ({
      byId: { [newRecipe._id]: newRecipe, ...prev.byId },
      allIds: [newRecipe._id, ...prev.allIds]
    }));
    
    setTimeout(() => {
      newRecipeIdsRef.current.delete(newRecipe._id);
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
    newRecipeIds: newRecipeIdsRef.current,
    loadedPages: loadedPagesRef.current,
    currentPage: currentPageRef.current,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    loadMore // PHASE 3: For virtualization
  };
};
