const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null values to be unique
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  profile: {
    displayName: {
      type: String,
      default: function() { return this.username; }
    },
    bio: {
      type: String,
      maxLength: 500,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    specialties: [{
      type: String
    }],
    isCreator: {
      type: Boolean,
      default: true
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    totalRecipes: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    }
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
