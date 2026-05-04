const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const RecipeMatchService = require('../services/recipeMatchService');
const authenticateJWT = require('../middleware/auth');

// upload is injected by the parent (index.js) and passed in via router-level middleware
// We receive it as a module-level variable set by the factory below.
let upload;

/**
 * Call this once from index.js to inject the multer upload instance.
 * @param {import('multer').Multer} multerUpload
 */
const setUpload = (multerUpload) => {
  upload = multerUpload;
};

// ─── POST /api/recipes ────────────────────────────────────────────────────────
router.post('/', authenticateJWT, (req, res, next) => {
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ])(req, res, next);
}, async (req, res) => {
  try {
    console.log('Recipe creation request received:', req.body);
    console.log('User ID:', req.user.id);

    const imagePath = req.files && req.files.image ? `/uploads/${path.basename(req.files.image[0].path)}` : '';
    const videoPath = req.files && req.files.video ? `/uploads/${path.basename(req.files.video[0].path)}` : '';

    // Convert ingredients string to array of objects
    let ingredients = [];
    if (req.body.ingredients) {
      const ingredientLines = req.body.ingredients.split('\n').filter(line => line.trim());
      ingredients = ingredientLines.map(line => {
        const trimmed = line.trim();
        return {
          name: trimmed,
          amount: '1', // Default amount
          optional: false,
        };
      });
    }

    // Ensure prepTime is a number
    const prepTime = parseInt(req.body.prepTime) || 0;

    console.log('Processed data:', {
      title: req.body.title,
      ingredients,
      instructions: req.body.instructions,
      category: req.body.category,
      prepTime,
      description: req.body.description,
      userId: req.user.id,
    });

    const recipe = new Recipe({
      title: req.body.title,
      ingredients,
      instructions: req.body.instructions,
      image: imagePath,
      video: videoPath,
      userId: req.user.id,
      category: req.body.category,
      prepTime,
      description: req.body.description,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      isPublic: req.body.isPublic !== 'false',
    });

    console.log('Recipe object created, attempting to save...');
    await recipe.save();
    console.log('Recipe saved successfully');

    // Update user's total recipes count
    const user = await User.findById(req.user.id);
    if (user) {
      user.profile.totalRecipes += 1;
      await user.save();
    }

    const populatedRecipe = {
      ...recipe.toObject(),
      image: imagePath ? `${req.protocol}://${req.get('host')}${imagePath}` : '',
      video: videoPath ? `${req.protocol}://${req.get('host')}${videoPath}` : '',
    };
    res.status(201).json({ message: 'Recipe created successfully', recipe: populatedRecipe });
  } catch (error) {
    console.error('Recipe creation error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Failed to create recipe', details: error.message });
  }
});

// ─── GET /api/recipes ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [recipeDocs, total] = await Promise.all([
      Recipe.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Recipe.countDocuments(),
    ]);

    const recipes = recipeDocs.map(recipe => {
      const recipeObj = recipe.toObject();

      if (!recipeObj._id || !mongoose.Types.ObjectId.isValid(recipeObj._id)) {
        console.warn('Recipe with invalid ID found:', recipeObj._id);
      }

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
      totalRecipes: total,
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ error: 'Failed to retrieve recipes', details: error.message });
  }
});

// ─── POST /api/recipes/match ──────────────────────────────────────────────────
// NOTE: This must be declared BEFORE /:id routes to avoid param collision.
router.post('/match', authenticateJWT, async (req, res) => {
  try {
    const { ingredients, filters, minMatch } = req.body;
    const matchedRecipes = await RecipeMatchService.findMatchingRecipes(ingredients, filters, minMatch);
    res.json(matchedRecipes);
  } catch (error) {
    console.error('Error matching recipes:', error);
    res.status(500).json({ error: 'Error matching recipes' });
  }
});

// ─── GET /api/recipes/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipeObj = recipe.toObject();
    if (recipeObj.ingredients && Array.isArray(recipeObj.ingredients)) {
      recipeObj.ingredients = recipeObj.ingredients.map(ing => ing.name).join('\n');
    }

    res.json(recipeObj);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recipe', details: error.message });
  }
});

// ─── PUT /api/recipes/:id ─────────────────────────────────────────────────────
router.put('/:id', authenticateJWT, (req, res, next) => {
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ])(req, res, next);
}, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.user.id });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or not authorized' });
    }

    recipe.title = req.body.title || recipe.title;

    if (req.body.ingredients) {
      const ingredientLines = req.body.ingredients.split('\n').filter(line => line.trim());
      recipe.ingredients = ingredientLines.map(line => {
        const trimmed = line.trim();
        return { name: trimmed, amount: '1', optional: false };
      });
    }

    recipe.instructions = req.body.instructions || recipe.instructions;
    recipe.category = req.body.category || recipe.category;
    recipe.prepTime = req.body.prepTime || recipe.prepTime;
    recipe.description = req.body.description || recipe.description;

    if (req.body.tags) {
      recipe.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    if (req.body.isPublic !== undefined) {
      recipe.isPublic = req.body.isPublic !== 'false';
    }

    if (req.files && req.files.image) {
      if (recipe.image) {
        const oldImagePath = path.join(__dirname, '..', recipe.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      recipe.image = `/uploads/${path.basename(req.files.image[0].path)}`;
    }

    if (req.files && req.files.video) {
      if (recipe.video) {
        const oldVideoPath = path.join(__dirname, '..', recipe.video);
        if (fs.existsSync(oldVideoPath)) fs.unlinkSync(oldVideoPath);
      }
      recipe.video = `/uploads/${path.basename(req.files.video[0].path)}`;
    }

    await recipe.save();

    const populatedRecipe = {
      ...recipe.toObject(),
      image: recipe.image ? `${req.protocol}://${req.get('host')}${recipe.image}` : '',
      video: recipe.video ? `${req.protocol}://${req.get('host')}${recipe.video}` : '',
    };

    res.json({ message: 'Recipe updated successfully', recipe: populatedRecipe });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update recipe', details: error.message });
  }
});

// ─── DELETE /api/recipes/:id ──────────────────────────────────────────────────
router.delete('/:id', authenticateJWT, async (req, res) => {
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

// ─── POST /api/recipes/:recipeId/missing-ingredients ─────────────────────────
router.post('/:recipeId/missing-ingredients', authenticateJWT, async (req, res) => {
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

// ─── POST /api/recipes/:id/like ───────────────────────────────────────────────
router.post('/:id/like', authenticateJWT, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const existingLike = recipe.likes.find(like => like.userId.toString() === req.user.id);

    if (existingLike) {
      recipe.likes = recipe.likes.filter(like => like.userId.toString() !== req.user.id);
      recipe.totalLikes = Math.max(0, recipe.totalLikes - 1);
    } else {
      recipe.likes.push({ userId: req.user.id });
      recipe.totalLikes += 1;
    }

    await recipe.save();

    // Update user's total likes
    const user = await User.findById(recipe.userId);
    if (user) {
      const userRecipes = await Recipe.find({ userId: recipe.userId });
      user.profile.totalLikes = userRecipes.reduce((total, r) => total + r.totalLikes, 0);
      await user.save();
    }

    res.json({
      message: existingLike ? 'Recipe unliked' : 'Recipe liked',
      totalLikes: recipe.totalLikes,
      isLiked: !existingLike,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Error toggling like' });
  }
});

// ─── GET /api/recipes/:id/share ───────────────────────────────────────────────
router.get('/:id/share', async (req, res) => {
  try {
    const recipeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      console.log('Invalid recipe ID format:', recipeId);
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }

    const recipe = await Recipe.findById(recipeId)
      .populate('userId', 'username profile.displayName profile.avatar');

    if (!recipe) {
      console.log('Recipe not found for ID:', recipeId);
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const baseUrl = req.protocol + '://' + req.get('host');
    const recipeUrl = `${baseUrl}/recipe/${recipe._id}`;
    const imageUrl = recipe.image ? `${baseUrl}${recipe.image}` : `${baseUrl}/default-recipe-image.jpg`;

    const creatorName = recipe.userId.profile.displayName || recipe.userId.username;

    const shareContent = {
      title: recipe.title,
      description: recipe.description || `Delicious ${recipe.category} recipe by ${creatorName}`,
      url: recipeUrl,
      image: imageUrl,
      creator: creatorName,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients.slice(0, 5).map(ing => ing.name).join(', '),
      templates: {
        whatsapp: `🍽️ *${recipe.title}* by ${creatorName}\n\n📝 ${recipe.description}\n\n⏱️ Prep time: ${recipe.prepTime} mins\n👥 Serves: ${recipe.servings}\n\n🥘 Key ingredients: ${recipe.ingredients.slice(0, 3).map(ing => ing.name).join(', ')}\n\nTry this amazing recipe: ${recipeUrl}`,
        facebook: `🍽️ Just discovered this amazing ${recipe.category} recipe: "${recipe.title}" by ${creatorName}!\n\n${recipe.description}\n\n⏱️ ${recipe.prepTime} minutes | 👥 Serves ${recipe.servings}\n\nCheck it out and try it yourself! 👨‍🍳👩‍🍳`,
        twitter: `🍽️ Amazing ${recipe.category} recipe: "${recipe.title}" by ${creatorName}\n\n⏱️ ${recipe.prepTime}min | 👥 Serves ${recipe.servings}\n\n#Recipe #Cooking #Homemade`,
        instagram: `🍽️ ${recipe.title}\nBy: ${creatorName}\n\n${recipe.description}\n\n⏱️ Prep: ${recipe.prepTime} mins\n👥 Serves: ${recipe.servings}\n\n#recipe #cooking #homemade #foodie #${recipe.category.toLowerCase()}`,
      },
    };

    recipe.shares += 1;
    await recipe.save();

    res.json(shareContent);
  } catch (error) {
    console.error('Error generating share content:', error);
    res.status(500).json({ error: 'Error generating share content' });
  }
});

module.exports = { router, setUpload };
