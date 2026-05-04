const express = require('express');
const router = express.Router();
const axios = require('axios');
const { cacheMiddleware } = require('../middleware/cache');

// ─── TheMealDB Routes ─────────────────────────────────────────────────────────

// GET /api/external-recipes/search?query=...
router.get('/external-recipes/search', cacheMiddleware(300), async (req, res) => {
  try {
    const query = req.query.query || '';
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    res.json(response.data.meals || []);
  } catch (err) {
    console.error('TheMealDB API error:', err);
    res.status(500).json({ error: 'Failed to fetch recipes', details: err.message });
  }
});

// GET /api/external-recipes/categories
router.get('/external-recipes/categories', cacheMiddleware(3600), async (req, res) => {
  try {
    const response = await axios.get(
      'https://www.themealdb.com/api/json/v1/1/categories.php'
    );
    res.json(response.data.categories || []);
  } catch (err) {
    console.error('TheMealDB API error:', err);
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
});

// GET /api/external-recipes/category/:category
router.get('/external-recipes/category/:category', cacheMiddleware(600), async (req, res) => {
  try {
    const category = req.params.category;
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    res.json(response.data.meals || []);
  } catch (err) {
    console.error('TheMealDB API error:', err);
    res.status(500).json({ error: 'Failed to fetch recipes by category', details: err.message });
  }
});

// GET /api/external-recipes/ingredient/:ingredient
router.get('/external-recipes/ingredient/:ingredient', async (req, res) => {
  try {
    const ingredient = req.params.ingredient;
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    res.json(response.data.meals || []);
  } catch (err) {
    console.error('TheMealDB API error:', err);
    res.status(500).json({ error: 'Failed to fetch recipes by ingredient', details: err.message });
  }
});

// GET /api/external-recipes/:id  (must be LAST to avoid catching named paths above)
router.get('/external-recipes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    res.json(response.data.meals ? response.data.meals[0] : null);
  } catch (err) {
    console.error('TheMealDB API error:', err);
    res.status(500).json({ error: 'Failed to fetch recipe details', details: err.message });
  }
});

// ─── Spoonacular Proxy Routes ─────────────────────────────────────────────────
// The API key never leaves the server; the client calls /api/spoonacular/*

// POST /api/spoonacular/parseIngredients
router.post('/spoonacular/parseIngredients', async (req, res) => {
  const key = process.env.SPOONACULAR_API_KEY;
  if (!key) return res.status(503).json({ error: 'Spoonacular API key not configured on server' });
  try {
    const response = await axios.post(
      `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${key}`,
      req.body,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    res.json(response.data);
  } catch (err) {
    console.error('Spoonacular parseIngredients error:', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// GET /api/spoonacular/findByIngredients
router.get('/spoonacular/findByIngredients', cacheMiddleware(300), async (req, res) => {
  const key = process.env.SPOONACULAR_API_KEY;
  if (!key) return res.status(503).json({ error: 'Spoonacular API key not configured on server' });
  try {
    const { ingredients, number = 12, ranking = 2, ignorePantry = true } = req.query;
    const response = await axios.get(
      'https://api.spoonacular.com/recipes/findByIngredients',
      { params: { apiKey: key, ingredients, number, ranking, ignorePantry } }
    );
    res.json(response.data);
  } catch (err) {
    console.error('Spoonacular findByIngredients error:', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// GET /api/spoonacular/recipes/:id/information
router.get('/spoonacular/recipes/:id/information', cacheMiddleware(600), async (req, res) => {
  const key = process.env.SPOONACULAR_API_KEY;
  if (!key) return res.status(503).json({ error: 'Spoonacular API key not configured on server' });
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${req.params.id}/information`,
      { params: { apiKey: key } }
    );
    res.json(response.data);
  } catch (err) {
    console.error('Spoonacular recipe info error:', err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

module.exports = router;
