require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache');
const apiCache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const RecipeMatchService = require('./services/recipeMatchService');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Connect to MongoDB with error handling
mongoose.connect('mongodb://127.0.0.1:27017/recipeapp')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get JWT secret from .env file or use a default (for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'mySuperSecretKey123!';

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
  console.log('Authentication middleware called');
  console.log('Headers:', req.headers);
  
  const token = req.headers.authorization;
  if (!token) {
    console.log('No token provided');
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    console.log('Token received:', token);
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Caching middleware
const cacheMiddleware = (duration) => (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = apiCache.get(key);
  
  if (cachedResponse) {
    res.json(cachedResponse);
  } else {
    res.originalJson = res.json;
    res.json = (body) => {
      apiCache.set(key, body, duration);
      res.originalJson(body);
    };
    next();
  }
};

// Test route to check if the server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Authentication Routes
// Signup Route (Register User) - No JWT required
app.post('/api/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Create new user
    console.log('Creating new user');
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();
    
    console.log('User created successfully');
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

// Login Route (Authenticate User and Generate JWT)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// TheMealDB API Routes

// Search recipes by name
app.get('/api/external-recipes/search', cacheMiddleware(300), async (req, res) => {
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

// Get recipe categories
app.get('/api/external-recipes/categories', cacheMiddleware(3600), async (req, res) => {
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

// Get recipes by category
app.get('/api/external-recipes/category/:category', cacheMiddleware(600), async (req, res) => {
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

// Get recipes by ingredient
app.get('/api/external-recipes/ingredient/:ingredient', async (req, res) => {
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

// Get recipe details by ID
app.get('/api/external-recipes/:id', async (req, res) => {
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

// Custom Recipes CRUD Routes
app.post('/api/recipes', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    console.log('Recipe creation request received:', req.body);
    console.log('User ID:', req.user.id);
    
    const imagePath = req.file ? `/uploads/${path.basename(req.file.path)}` : '';
    
    // Convert ingredients string to array of objects
    let ingredients = [];
    if (req.body.ingredients) {
      // Split by newlines and filter out empty lines
      const ingredientLines = req.body.ingredients.split('\n').filter(line => line.trim());
      ingredients = ingredientLines.map(line => {
        const trimmed = line.trim();
        return {
          name: trimmed,
          amount: '1', // Default amount
          optional: false
        };
      });
    }
    
    // Ensure prepTime is a number
    const prepTime = parseInt(req.body.prepTime) || 0;
    
    console.log('Processed data:', {
      title: req.body.title,
      ingredients: ingredients,
      instructions: req.body.instructions,
      category: req.body.category,
      prepTime: prepTime,
      description: req.body.description,
      userId: req.user.id
    });
    
    const recipe = new Recipe({
      title: req.body.title,
      ingredients: ingredients,
      instructions: req.body.instructions,
      image: imagePath,
      userId: req.user.id,
      category: req.body.category,
      prepTime: prepTime,
      description: req.body.description,
    });
    
    console.log('Recipe object created, attempting to save...');
    await recipe.save();
    console.log('Recipe saved successfully');
    
    const populatedRecipe = { 
      ...recipe.toObject(), 
      image: imagePath ? `${req.protocol}://${req.get('host')}${imagePath}` : '' 
    };
    res.status(201).json({ message: 'Recipe created successfully', recipe: populatedRecipe });
  } catch (error) {
    console.error('Recipe creation error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to create recipe', details: error.message });
  }
});

app.get('/api/recipes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [recipeDocs, total] = await Promise.all([
      Recipe.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Recipe.countDocuments()
    ]);

    const recipes = recipeDocs.map(recipe => {
      const recipeObj = recipe.toObject();
      if (recipeObj.image) {
        recipeObj.image = `${req.protocol}://${req.get('host')}${recipeObj.image}`;
      }
      // Convert ingredients array back to string for frontend compatibility
      if (recipeObj.ingredients && Array.isArray(recipeObj.ingredients)) {
        recipeObj.ingredients = recipeObj.ingredients.map(ing => ing.name).join('\n');
      }
      return recipeObj;
    });

    res.json({
      recipes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecipes: total
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ error: 'Failed to retrieve recipes', details: error.message });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    
    const recipeObj = recipe.toObject();
    // Convert ingredients array back to string for frontend compatibility
    if (recipeObj.ingredients && Array.isArray(recipeObj.ingredients)) {
      recipeObj.ingredients = recipeObj.ingredients.map(ing => ing.name).join('\n');
    }
    
    res.json(recipeObj);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recipe', details: error.message });
  }
});

app.put('/api/recipes/:id', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.user.id });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }

    // Update basic fields
    recipe.title = req.body.title || recipe.title;
    
    // Convert ingredients string to array of objects if provided
    if (req.body.ingredients) {
      const ingredientLines = req.body.ingredients.split('\n').filter(line => line.trim());
      recipe.ingredients = ingredientLines.map(line => {
        const trimmed = line.trim();
        return {
          name: trimmed,
          amount: '1', // Default amount
          optional: false
        };
      });
    }
    
    recipe.instructions = req.body.instructions || recipe.instructions;
    recipe.category = req.body.category || recipe.category;
    recipe.prepTime = req.body.prepTime || recipe.prepTime;
    recipe.description = req.body.description || recipe.description;

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (recipe.image) {
        const oldImagePath = path.join(__dirname, recipe.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Store new image path
      recipe.image = `/uploads/${path.basename(req.file.path)}`;
    }
    
    await recipe.save();
    
    // Create populated recipe object with full image URL
    const populatedRecipe = {
      ...recipe.toObject(),
      image: recipe.image ? `${req.protocol}://${req.get('host')}${recipe.image}` : ''
    };
    
    res.json({ message: 'Recipe updated successfully', recipe: populatedRecipe });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update recipe', details: error.message });
  }
});

app.delete('/api/recipes/:id', authenticateJWT, async (req, res) => {
  try {
    const result = await Recipe.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe', details: error.message });
  }
});

// FridgeMate Routes

// Update user's pantry ingredients
app.post('/api/user/pantry', authenticateJWT, async (req, res) => {
  try {
    const { ingredients } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.pantryIngredients = ingredients.map(ing => ({
      name: ing.name,
      category: ing.category || 'other'
    }));

    await user.save();
    res.json({ message: 'Pantry updated successfully', pantryIngredients: user.pantryIngredients });
  } catch (error) {
    console.error('Error updating pantry:', error);
    res.status(500).json({ error: 'Error updating pantry' });
  }
});

// Get user's pantry ingredients
app.get('/api/user/pantry', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.pantryIngredients);
  } catch (error) {
    console.error('Error fetching pantry:', error);
    res.status(500).json({ error: 'Error fetching pantry' });
  }
});

// Find matching recipes based on user's ingredients
app.post('/api/recipes/match', authenticateJWT, async (req, res) => {
  try {
    const { ingredients, filters, minMatch } = req.body;
    
    // Get matching recipes
    const matchedRecipes = await RecipeMatchService.findMatchingRecipes(
      ingredients,
      filters,
      minMatch
    );

    res.json(matchedRecipes);
  } catch (error) {
    console.error('Error matching recipes:', error);
    res.status(500).json({ error: 'Error matching recipes' });
  }
});

// Get missing ingredients for a specific recipe
app.post('/api/recipes/:recipeId/missing-ingredients', authenticateJWT, async (req, res) => {
  try {
    const { ingredients } = req.body;
    const recipe = await Recipe.findById(req.params.recipeId);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const missingIngredients = RecipeMatchService.findMissingIngredients(
      ingredients,
      recipe.ingredients
    );

    res.json(missingIngredients);
  } catch (error) {
    console.error('Error finding missing ingredients:', error);
    res.status(500).json({ error: 'Error finding missing ingredients' });
  }
});

// Update user's dietary preferences
app.post('/api/user/preferences', authenticateJWT, async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.dietaryPreferences = {
      ...user.dietaryPreferences,
      ...preferences
    };

    await user.save();
    res.json({ message: 'Preferences updated successfully', preferences: user.dietaryPreferences });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Error updating preferences' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error', details: err.message });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
