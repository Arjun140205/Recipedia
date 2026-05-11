import { useState, useEffect, useRef, useCallback, useReducer, startTransition } from 'react';
import { getRecipes } from '../services/recipeService';
import { toast } from 'react-toastify';

const initialState = {
  recipeState: { byId: {}, allIds: [] },
  loading: false,
  initialLoading: true,
  hasMore: true,
};

function scrollReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true };
    case 'INITIAL_FETCH_START':
      return { ...state, loading: true, initialLoading: true };
    case 'FETCH_ERROR':
      return { ...state, loading: false, initialLoading: false };
    case 'INITIAL_PAGE_LOADED': {
      const { recipes, hasMore } = action.payload;
      const byId = {};
      const allIds = [];
      recipes.forEach(recipe => {
        byId[recipe._id] = recipe;
        allIds.push(recipe._id);
      });
      return {
        ...state,
        recipeState: { byId, allIds },
        hasMore,
        loading: false,
        initialLoading: false
      };
    }
    case 'BACKGROUND_BATCH_LOADED': {
      const { recipes, hasMore } = action.payload;
      let changed = false;
      const newById = { ...state.recipeState.byId };
      const newAllIds = [...state.recipeState.allIds];
      
      recipes.forEach(recipe => {
        if (!newById[recipe._id]) {
          newById[recipe._id] = recipe;
          newAllIds.push(recipe._id);
          changed = true;
        }
      });
      
      if (!changed && state.hasMore === hasMore) return state;
      
      return {
        ...state,
        recipeState: changed ? { byId: newById, allIds: newAllIds } : state.recipeState,
        hasMore
      };
    }
    case 'PAGE_LOADED': {
      const { recipes, hasMore } = action.payload;
      let changed = false;
      const newById = { ...state.recipeState.byId };
      const newAllIds = [...state.recipeState.allIds];
      
      recipes.forEach(recipe => {
        if (!newById[recipe._id]) {
          newById[recipe._id] = recipe;
          newAllIds.push(recipe._id);
          changed = true;
        }
      });
      
      return {
        ...state,
        recipeState: changed ? { byId: newById, allIds: newAllIds } : state.recipeState,
        hasMore,
        loading: false
      };
    }
    case 'ADD_RECIPE': {
      const { recipe } = action.payload;
      return {
        ...state,
        recipeState: {
          byId: { [recipe._id]: recipe, ...state.recipeState.byId },
          allIds: [recipe._id, ...state.recipeState.allIds]
        }
      };
    }
    case 'UPDATE_RECIPE': {
      const { recipeId, updatedRecipe } = action.payload;
      return {
        ...state,
        recipeState: {
          ...state.recipeState,
          byId: { ...state.recipeState.byId, [recipeId]: updatedRecipe }
        }
      };
    }
    case 'DELETE_RECIPE': {
      const { recipeId } = action.payload;
      const newById = { ...state.recipeState.byId };
      delete newById[recipeId];
      return {
        ...state,
        recipeState: {
          byId: newById,
          allIds: state.recipeState.allIds.filter(id => id !== recipeId)
        }
      };
    }
    default:
      return state;
  }
}

// Custom hook for infinite scroll logic - ISOLATED from UI components
export const useInfiniteScroll = (itemsPerPage = 12) => {
  const [state, dispatch] = useReducer(scrollReducer, initialState);
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
        dispatch({ type: 'INITIAL_FETCH_START' });

        // LCP OPTIMIZATION: Fetch only 6 recipes initially (above-the-fold)
        // This reduces initial load time and improves LCP
        const initialBatchSize = 6;
        const recipesData = await getRecipes(1, initialBatchSize);
        
        dispatch({
          type: 'INITIAL_PAGE_LOADED',
          payload: {
            recipes: recipesData.recipes,
            hasMore: recipesData.currentPage < recipesData.totalPages
          }
        });
        
        // Mark first page as loaded
        loadedPagesRef.current.add(1);
        currentPageRef.current = 1;
        
        console.log('[useInfiniteScroll] Initial load normalized (LCP optimized):', {
          recipesCount: recipesData.recipes.length,
          pagesLoaded: Array.from(loadedPagesRef.current)
        });

        // LCP OPTIMIZATION: Fetch next batch in background without artificial delay
        // This provides a smooth UX while keeping the initial render prioritized
        (async () => {
          try {
            const nextBatchSize = 24; // Fetch 24 more (total 30)
            const nextRecipesData = await getRecipes(2, nextBatchSize);
            
            startTransition(() => {
              dispatch({
                type: 'BACKGROUND_BATCH_LOADED',
                payload: {
                  recipes: nextRecipesData.recipes,
                  hasMore: nextRecipesData.currentPage < nextRecipesData.totalPages
                }
              });
            });
            
            loadedPagesRef.current.add(2);
            currentPageRef.current = 2;
          } catch (error) {
            console.error('Error loading background batch:', error);
          }
        })();
        
      } catch (error) {
        toast.error('Failed to fetch recipes');
        console.error('Error fetching recipes:', error);
        dispatch({ type: 'FETCH_ERROR' });
      } finally {
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
      dispatch({ type: 'FETCH_START' });
      
      const recipesData = await getRecipes(pageToLoad, itemsPerPage);
      
      // We need to know which ones are new for the animation, so we calculate addedIds here.
      // But we don't have direct access to state.recipeState.byId unless we add it to dependencies
      // To avoid adding it to dependencies, we can just assume any fetched recipe that isn't already known
      // by the reducer will be added. Let's just pass them to the reducer and dispatch.
      
      const newlyFetchedIds = recipesData.recipes.map(r => r._id);
      
      startTransition(() => {
        dispatch({
          type: 'PAGE_LOADED',
          payload: {
            recipes: recipesData.recipes,
            hasMore: recipesData.currentPage < recipesData.totalPages
          }
        });
      });
      
      // Mark new recipes for animation via state
      if (newlyFetchedIds.length > 0) {
        newlyFetchedIds.forEach(id => newRecipeIdsRef.current.add(id));
        setNewRecipeIds(new Set(newRecipeIdsRef.current));
        setTimeout(() => {
          newlyFetchedIds.forEach(id => newRecipeIdsRef.current.delete(id));
          setNewRecipeIds(new Set(newRecipeIdsRef.current));
        }, 500);
      }
      
      loadedPagesRef.current.add(pageToLoad);
      
    } catch (error) {
      console.error('Error loading more recipes:', error);
      toast.error('Failed to load more recipes');
      dispatch({ type: 'FETCH_ERROR' });
    } finally {
      isLoadingRef.current = false;
    }
  }, [itemsPerPage]); // PHASE 2.2: Removed recipeState dependency - using functional updates



  // Add recipe to cache
  const addRecipe = useCallback((newRecipe) => {
    newRecipeIdsRef.current.add(newRecipe._id);
    setNewRecipeIds(new Set(newRecipeIdsRef.current));
    
    // PHASE 2: Update normalized structure
    dispatch({ type: 'ADD_RECIPE', payload: { recipe: newRecipe } });
    
    setTimeout(() => {
      newRecipeIdsRef.current.delete(newRecipe._id);
      setNewRecipeIds(new Set(newRecipeIdsRef.current));
    }, 500);
  }, []);

  // Update recipe in cache
  const updateRecipe = useCallback((recipeId, updatedRecipe) => {
    // PHASE 2: Update in normalized structure
    dispatch({ type: 'UPDATE_RECIPE', payload: { recipeId, updatedRecipe } });
  }, []);

  // Delete recipe from cache
  const deleteRecipe = useCallback((recipeId) => {
    // PHASE 2: Remove from normalized structure
    dispatch({ type: 'DELETE_RECIPE', payload: { recipeId } });
  }, []);

  // PHASE 3: Expose loadMore for virtualization
  const loadMore = useCallback(() => {
    if (!state.hasMore || isLoadingRef.current) return;
    
    const nextPage = currentPageRef.current + 1;
    if (!loadedPagesRef.current.has(nextPage)) {
      currentPageRef.current = nextPage;
      loadMoreRecipes(nextPage);
    }
  }, [state.hasMore, loadMoreRecipes]);

  return {
    // PHASE 2: Return normalized data
    recipesById: state.recipeState.byId,
    recipeIds: state.recipeState.allIds,
    loading: state.loading,
    initialLoading: state.initialLoading, // NEW: Track initial load state
    hasMore: state.hasMore,
    newRecipeIds, // FIX: React state-based Set for stable memo comparisons
    loadedPages: loadedPagesRef.current,
    currentPage: currentPageRef.current,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    loadMore // PHASE 3: For virtualization
  };
};
