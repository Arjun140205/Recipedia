const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const authenticateJWT = require('../middleware/auth');

// upload is injected from index.js
let upload;
const setUpload = (multerUpload) => {
  upload = multerUpload;
};

// ─── POST /api/user/pantry ────────────────────────────────────────────────────
// Update user's pantry ingredients
router.post('/pantry', authenticateJWT, async (req, res) => {
  try {
    const { ingredients } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.pantryIngredients = ingredients.map(ing => ({
      name: ing.name,
      category: ing.category || 'other',
    }));

    await user.save();
    res.json({ message: 'Pantry updated successfully', pantryIngredients: user.pantryIngredients });
  } catch (error) {
    console.error('Error updating pantry:', error);
    res.status(500).json({ error: 'Error updating pantry' });
  }
});

// ─── GET /api/user/pantry ─────────────────────────────────────────────────────
// Get user's pantry ingredients
router.get('/pantry', authenticateJWT, async (req, res) => {
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

// ─── POST /api/user/preferences ───────────────────────────────────────────────
// Update user's dietary preferences
router.post('/preferences', authenticateJWT, async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.dietaryPreferences = {
      ...user.dietaryPreferences,
      ...preferences,
    };

    await user.save();
    res.json({ message: 'Preferences updated successfully', preferences: user.dietaryPreferences });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Error updating preferences' });
  }
});

// ─── GET /api/user/profile/:userId ───────────────────────────────────────────
// Get a public user profile by userId (no auth required)
// NOTE: Must be declared BEFORE /profile to avoid Express matching /profile as :userId
router.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const user = await User.findById(userId)
      .select('-password')
      .populate('profile.followers', 'username profile.displayName profile.avatar')
      .populate('profile.following', 'username profile.displayName profile.avatar');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// ─── GET /api/user/profile ────────────────────────────────────────────────────
// Get the currently authenticated user's profile
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('profile.followers', 'username profile.displayName profile.avatar')
      .populate('profile.following', 'username profile.displayName profile.avatar');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// ─── PUT /api/user/profile ────────────────────────────────────────────────────
// Update authenticated user's profile (with optional avatar upload)
router.put('/profile', authenticateJWT, (req, res, next) => {
  upload.single('avatar')(req, res, next);
}, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { displayName, email, bio, location, specialties } = req.body;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      user.email = email;
    }

    if (displayName) user.profile.displayName = displayName;
    if (bio !== undefined) user.profile.bio = bio;
    if (location !== undefined) user.profile.location = location;
    if (specialties) {
      user.profile.specialties =
        typeof specialties === 'string'
          ? specialties.split(',').map(s => s.trim()).filter(Boolean)
          : specialties;
    }

    if (req.file) {
      if (user.profile.avatar) {
        const oldAvatarPath = path.join(__dirname, '..', user.profile.avatar);
        if (fs.existsSync(oldAvatarPath)) fs.unlinkSync(oldAvatarPath);
      }
      user.profile.avatar = `/uploads/${path.basename(req.file.path)}`;
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: 'Profile updated successfully', user: userResponse });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile', details: error.message });
  }
});

module.exports = { router, setUpload };
