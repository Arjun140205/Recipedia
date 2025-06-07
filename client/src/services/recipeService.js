import axios from 'axios';

const API_URL = 'http://localhost:5000/api/recipes';

export const getRecipes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createRecipe = async (recipeData) => {
  const response = await axios.post(API_URL, recipeData);
  return response.data;
};

export const updateRecipe = async (id, recipeData) => {
  const response = await axios.put(`${API_URL}/${id}`, recipeData);
  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}; 