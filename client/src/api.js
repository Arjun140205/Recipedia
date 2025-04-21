import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const login = async (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};

export const signup = async (userData) => {
  return axios.post(`${API_URL}/signup`, userData);
};

export const getRecipes = async (page = 1, limit = 10) => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/recipes`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createRecipe = async (formData) => {
  const token = localStorage.getItem('token');
  return axios.post(`${API_URL}/recipes`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateRecipe = async (recipeId, formData) => {
  const token = localStorage.getItem('token');
  return axios.put(`${API_URL}/recipes/${recipeId}`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteRecipe = async (recipeId) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${API_URL}/recipes/${recipeId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};