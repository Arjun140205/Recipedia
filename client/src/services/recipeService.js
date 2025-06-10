import axios from 'axios';

const API_URL = 'http://localhost:8000/api/recipes';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const getRecipes = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeader() });
  return response.data.recipes;
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
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.recipe;
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
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.recipe;
  } catch (error) {
    if (error.response?.status === 413) {
      throw new Error('Image file is too large. Please use a smaller image.');
    }
    throw error;
  }
};

export const deleteRecipe = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
}; 