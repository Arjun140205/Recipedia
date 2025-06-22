const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  pantryIngredients: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['produce', 'dairy', 'meat', 'grains', 'spices', 'other'],
      default: 'other'
    },
    addedDate: {
      type: Date,
      default: Date.now
    }
  }],
  dietaryPreferences: {
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
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
