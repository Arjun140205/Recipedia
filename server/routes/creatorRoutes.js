const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// ─── GET /api/creators ────────────────────────────────────────────────────────
// Get all creators (paginated)
router.get('/', async (req, res) => {
  try {
    console.log('Creators endpoint called');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    console.log('Total users in database:', totalUsers);

    // Get creators: users with isCreator flag or at least one recipe
    const creators = await User.find({
      $or: [
        { 'profile.isCreator': true },
        { 'profile.totalRecipes': { $gt: 0 } },
      ],
    })
      .select('-password')
      .sort({ 'profile.totalRecipes': -1, 'profile.totalLikes': -1 })
      .skip(skip)
      .limit(limit);

    console.log('Found creators:', creators.length);

    const total = await User.countDocuments({
      $or: [
        { 'profile.isCreator': true },
        { 'profile.totalRecipes': { $gt: 0 } },
      ],
    });

    // If no creators found, fall back to all users and mark them as creators
    if (creators.length === 0 && totalUsers > 0) {
      console.log('No creators found, returning all users as potential creators');
      const allUsers = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      for (let user of allUsers) {
        if (!user.profile.isCreator) {
          user.profile.isCreator = true;
          await user.save();
        }
      }

      return res.json({
        creators: allUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalCreators: totalUsers,
      });
    }

    res.json({
      creators,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCreators: total,
    });
  } catch (error) {
    console.error('Error fetching creators:', error);
    res.status(500).json({ error: 'Error fetching creators', details: error.message });
  }
});

// ─── GET /api/creators/:userId/recipes ────────────────────────────────────────
// Get all public recipes by a specific creator (paginated)
router.get('/:userId/recipes', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find({ userId, isPublic: true })
      .populate('userId', 'username profile.displayName profile.avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments({ userId, isPublic: true });

    res.json({
      recipes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecipes: total,
    });
  } catch (error) {
    console.error('Error fetching creator recipes:', error);
    res.status(500).json({ error: 'Error fetching creator recipes' });
  }
});

module.exports = router;
