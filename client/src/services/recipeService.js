import axios from 'axios';

const BASE_URL = 'https://recipedia-2si5.onrender.com/api';
const RECIPES_URL = `${BASE_URL}/recipes`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

// Helper function to normalize recipe data for frontend compatibility
const normalizeRecipe = (recipe) => {
  if (!recipe) return recipe;

  const normalized = { ...recipe };

  // Convert ingredients array to string if needed
  if (normalized.ingredients && Array.isArray(normalized.ingredients)) {
    normalized.ingredients = normalized.ingredients.map(ing => ing.name).join('\n');
  }

  // Ensure recipe has a valid _id
  if (normalized._id) {
    // Clean and validate the ID
    normalized._id = String(normalized._id).trim();
    
    if (normalized._id.length !== 24) {
      console.warn('Recipe has invalid _id length:', normalized._id.length, 'ID:', normalized._id, 'Recipe:', normalized);
      // Don't replace valid IDs, just mark them for special handling
      normalized.hasInvalidId = true;
    }
  } else {
    console.warn('Recipe missing _id:', normalized);
    // Generate a temporary ID for display purposes
    normalized._id = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    normalized.isTemporary = true;
  }

  return normalized;
};

export const getRecipes = async () => {
  const response = await axios.get(RECIPES_URL, { headers: getAuthHeader() });
  return response.data.recipes.map(normalizeRecipe);
};

export const createRecipe = async (recipeData) => {
  const formData = new FormData();

  // Handle all fields except image first
  Object.keys(recipeData).forEach(key => {
    if (key !== 'image') {
      formData.append(key, recipeData[key]);
    }
  });

  // Handle image separately
  if (recipeData.image) {
    if (recipeData.image.startsWith('data:')) {
      // Convert base64 to file
      const byteString = atob(recipeData.image.split(',')[1]);
      const mimeString = recipeData.image.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // Generate a unique filename
      const timestamp = Date.now();
      const filename = `image-${timestamp}.${mimeString.split('/')[1]}`;
      formData.append('image', blob, filename);
    } else if (recipeData.image instanceof File) {
      formData.append('image', recipeData.image);
    }
  }

  try {
    const response = await axios.post(RECIPES_URL, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return normalizeRecipe(response.data.recipe);
  } catch (error) {
    if (error.response?.status === 413) {
      throw new Error('Image file is too large. Please use a smaller image.');
    }
    throw error;
  }
};

export const updateRecipe = async (id, recipeData) => {
  const formData = new FormData();

  // Handle all fields except image first
  Object.keys(recipeData).forEach(key => {
    if (key !== 'image') {
      formData.append(key, recipeData[key]);
    }
  });

  // Handle image separately
  if (recipeData.image) {
    if (recipeData.image.startsWith('data:')) {
      // Convert base64 to file
      const byteString = atob(recipeData.image.split(',')[1]);
      const mimeString = recipeData.image.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // Generate a unique filename
      const timestamp = Date.now();
      const filename = `image-${timestamp}.${mimeString.split('/')[1]}`;
      formData.append('image', blob, filename);
    } else if (recipeData.image instanceof File) {
      formData.append('image', recipeData.image);
    }
  }

  try {
    const response = await axios.put(`${RECIPES_URL}/${id}`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return normalizeRecipe(response.data.recipe);
  } catch (error) {
    if (error.response?.status === 413) {
      throw new Error('Image file is too large. Please use a smaller image.');
    }
    throw error;
  }
};

export const deleteRecipe = async (id) => {
  const response = await axios.delete(`${RECIPES_URL}/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const findMatchingRecipes = async (ingredients, filters = {}, minMatch = 60) => {
  try {
    const response = await axios.post(
      `${RECIPES_URL}/match`,
      { ingredients, filters, minMatch },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error finding matching recipes:', error);
    throw error;
  }
};

export const getMissingIngredients = async (recipeId, ingredients) => {
  try {
    const response = await axios.post(
      `${RECIPES_URL}/${recipeId}/missing-ingredients`,
      { ingredients },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting missing ingredients:', error);
    throw error;
  }
};

export const updatePantryIngredients = async (ingredients) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/pantry`,
      { ingredients },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating pantry ingredients:', error);
    throw error;
  }
};

export const getPantryIngredients = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/pantry`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting pantry ingredients:', error);
    throw error;
  }
};

export const updateUserPreferences = async (preferences) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/preferences`,
      { preferences },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};