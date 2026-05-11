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
      image: imagePath || '',
      video: videoPath || '',
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
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor; // ObjectId string of last recipe from previous page
    const query = cursor ? { _id: { $lt: new mongoose.Types.ObjectId(cursor) } } : {};
    const recipeDocs = await Recipe.find(query, { likes: 0, instructions: 0 })
      .sort({ _id: -1 })
      .limit(limit);
    // Total count for pagination UI (optional)
    const total = await Recipe.countDocuments();
    const nextCursor = recipeDocs.length ? recipeDocs[recipeDocs.length - 1]._id : null;
    const recipes = recipeDocs.map(recipe => {
      const recipeObj = recipe.toObject();

      if (!recipeObj._id || !mongoose.Types.ObjectId.isValid(recipeObj._id)) {
        console.warn('Recipe with invalid ID found:', recipeObj._id);
      }

      // Image stays as relative path (e.g. /uploads/filename.jpg).
      // The frontend resolves the full URL using SERVER_URL from config.js.
      // This avoids instability from req.protocol/host changing between requests.
      // Convert ingredients array back to string for frontend compatibility
      if (recipeObj.ingredients && Array.isArray(recipeObj.ingredients)) {
        recipeObj.ingredients = recipeObj.ingredients.map(ing => ing.name).join('\n');
      }
      return recipeObj;
    });

    // Compute ETag based on latest updatedAt timestamp for caching
    const latestUpdatedAt = recipeDocs.reduce((max, r) => {
      const updated = r.updatedAt || r.createdAt;
      return updated > max ? updated : max;
    }, new Date(0));
    const etag = `W/"${latestUpdatedAt.getTime()}"`;
    // Set caching headers
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.set('ETag', etag);
    // Return 304 if client cache is valid
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }
    res.json({
      recipes,
      nextCursor,
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
    const { ingredients, filters, minMatch, page, limit } = req.body;
    
    // Parse pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    const matchedData = await RecipeMatchService.findMatchingRecipes(
      ingredients, 
      filters, 
      minMatch, 
      pageNum, 
      limitNum
    );
    
    res.json(matchedData);
  } catch (error) {
    console.error('Error matching recipes:', error);
    res.status(500).json({ error: 'Error matching recipes' });
  }
});

// ─── GET /api/recipes/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  // Validate ObjectId format before hitting the DB.
  // Without this, Mongoose throws a CastError which we'd surface as a 500,
  // but a bad ID is a client error → 400, not a server error → 500.
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid recipe ID format' });
  }

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
      image: recipe.image || '',
      video: recipe.video || '',
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

    // For share links we still need a full URL. Use x-forwarded-proto if behind a proxy.
    const protocol = req.get('x-forwarded-proto') || req.protocol;
    const baseUrl = protocol + '://' + req.get('host');
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
