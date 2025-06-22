const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: {
    type: String,
    default: ''
  },
  ingredients: [{ 
    name: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    optional: {
      type: Boolean,
      default: false
    }
  }],
  instructions: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String 
  },
  category: {
    type: String,
    required: true
  },
  prepTime: {
    type: Number, // in minutes
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  dietary: {
    vegetarian: {
      type: Boolean,
      default: false
    },
    vegan: {
      type: Boolean,
      default: false
    },
    glutenFree: {
      type: Boolean,
      default: false
    }
  },
  servings: {
    type: Number,
    required: true,
    default: 4
  },
  popularity: {
    type: Number,
    default: 0
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
