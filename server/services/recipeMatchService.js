const Recipe = require('../models/Recipe');

class RecipeMatchService {
  /**
   * Calculate match percentage between user ingredients and recipe ingredients
   * @param {Array} userIngredients - Array of ingredient names the user has
   * @param {Array} recipeIngredients - Array of recipe ingredient objects
   * @returns {number} Match percentage (0-100)
   */
  static calculateMatchPercentage(userIngredients, recipeIngredients) {
    const requiredIngredients = recipeIngredients.filter(ing => !ing.optional);
    const optionalIngredients = recipeIngredients.filter(ing => ing.optional);
    
    // Convert ingredient names to lowercase for case-insensitive comparison
    const normalizedUserIngredients = userIngredients.map(ing => ing.toLowerCase());
    
    // Check required ingredients
    const matchedRequired = requiredIngredients.filter(ing => 
      normalizedUserIngredients.includes(ing.name.toLowerCase())
    );

    // Check optional ingredients
    const matchedOptional = optionalIngredients.filter(ing => 
      normalizedUserIngredients.includes(ing.name.toLowerCase())
    );

    // Calculate match percentage
    const requiredWeight = 0.7; // Required ingredients are worth 70% of the score
    const optionalWeight = 0.3; // Optional ingredients are worth 30% of the score

    const requiredScore = requiredIngredients.length === 0 ? 1 : 
      matchedRequired.length / requiredIngredients.length;
    
    const optionalScore = optionalIngredients.length === 0 ? 1 :
      matchedOptional.length / optionalIngredients.length;

    const totalScore = (requiredScore * requiredWeight) + (optionalScore * optionalWeight);
    
    return Math.round(totalScore * 100);
  }

  /**
   * Find recipes that match user's ingredients
   * @param {Array} userIngredients - Array of ingredient names
   * @param {Object} filters - Optional filters (vegetarian, maxPrepTime, etc.)
   * @param {number} minMatch - Minimum match percentage (0-100)
   * @returns {Array} Matching recipes with match percentages
   */
  static async findMatchingRecipes(userIngredients, filters = {}, minMatch = 60) {
    let query = {};

    // Apply dietary filters
    if (filters.vegetarian) {
      query['dietary.vegetarian'] = true;
    }
    if (filters.vegan) {
      query['dietary.vegan'] = true;
    }
    if (filters.glutenFree) {
      query['dietary.glutenFree'] = true;
    }

    // Apply time filter
    if (filters.maxPrepTime) {
      query.prepTime = { $lte: filters.maxPrepTime };
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      query.difficulty = filters.difficulty;
    }

    // Get all recipes that match the basic filters
    const recipes = await Recipe.find(query);

    // Calculate match percentage for each recipe
    const matchedRecipes = recipes.map(recipe => {
      const matchPercentage = this.calculateMatchPercentage(userIngredients, recipe.ingredients);
      return {
        ...recipe.toObject(),
        matchPercentage
      };
    });

    // Filter by minimum match percentage and sort by match percentage
    return matchedRecipes
      .filter(recipe => recipe.matchPercentage >= minMatch)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  /**
   * Suggest missing ingredients for a recipe
   * @param {Array} userIngredients - Array of ingredient names the user has
   * @param {Array} recipeIngredients - Array of recipe ingredient objects
   * @returns {Array} Missing ingredients
   */
  static findMissingIngredients(userIngredients, recipeIngredients) {
    const normalizedUserIngredients = userIngredients.map(ing => ing.toLowerCase());
    
    return recipeIngredients.filter(ing => 
      !normalizedUserIngredients.includes(ing.name.toLowerCase())
    );
  }
}

module.exports = RecipeMatchService;
