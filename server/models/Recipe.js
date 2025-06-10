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
  ingredients: { 
    type: String, 
    required: true 
  },
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
    type: Number,
    required: true
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
