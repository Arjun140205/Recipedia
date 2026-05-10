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
  static async findMatchingRecipes(userIngredients, filters = {}, minMatch = 60, page = 1, limit = 10) {
    let query = {};
    const skip = (page - 1) * limit;

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

    const normalizedUserIngredients = userIngredients.map(ing => ing.toLowerCase());

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          processedIngredients: {
            $map: {
              input: { $ifNull: ["$ingredients", []] },
              as: "ing",
              in: {
                name: { $toLower: "$$ing.name" },
                optional: { $ifNull: ["$$ing.optional", false] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          requiredIngredients: {
            $filter: {
              input: "$processedIngredients",
              as: "ing",
              cond: { $not: "$$ing.optional" }
            }
          },
          optionalIngredients: {
            $filter: {
              input: "$processedIngredients",
              as: "ing",
              cond: "$$ing.optional"
            }
          }
        }
      },
      {
        $addFields: {
          matchedRequiredCount: {
            $size: {
              $filter: {
                input: "$requiredIngredients",
                as: "ing",
                cond: { $in: ["$$ing.name", normalizedUserIngredients] }
              }
            }
          },
          matchedOptionalCount: {
            $size: {
              $filter: {
                input: "$optionalIngredients",
                as: "ing",
                cond: { $in: ["$$ing.name", normalizedUserIngredients] }
              }
            }
          },
          requiredTotal: { $size: "$requiredIngredients" },
          optionalTotal: { $size: "$optionalIngredients" }
        }
      },
      {
        $addFields: {
          requiredScore: {
            $cond: [
              { $eq: ["$requiredTotal", 0] },
              1,
              { $divide: ["$matchedRequiredCount", "$requiredTotal"] }
            ]
          },
          optionalScore: {
            $cond: [
              { $eq: ["$optionalTotal", 0] },
              1,
              { $divide: ["$matchedOptionalCount", "$optionalTotal"] }
            ]
          }
        }
      },
      {
        $addFields: {
          matchPercentage: {
            $round: [
              {
                $multiply: [
                  {
                    $add: [
                      { $multiply: ["$requiredScore", 0.7] },
                      { $multiply: ["$optionalScore", 0.3] }
                    ]
                  },
                  100
                ]
              },
              0
            ]
          }
        }
      },
      { $match: { matchPercentage: { $gte: minMatch } } },
      { $sort: { matchPercentage: -1 } },
      {
        $facet: {
          metadata: [ { $count: "total" } ],
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                processedIngredients: 0,
                requiredIngredients: 0,
                optionalIngredients: 0,
                matchedRequiredCount: 0,
                matchedOptionalCount: 0,
                requiredTotal: 0,
                optionalTotal: 0,
                requiredScore: 0,
                optionalScore: 0
              }
            }
          ]
        }
      }
    ];

    const results = await Recipe.aggregate(pipeline);
    const total = results[0].metadata[0] ? results[0].metadata[0].total : 0;
    const recipes = results[0].data;

    return {
      recipes,
      totalRecipes: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    };
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
