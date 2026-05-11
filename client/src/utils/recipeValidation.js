import DOMPurify from 'dompurify';

/**
 * Validates recipe form data and returns an object of field-level errors.
 * Returns an empty object if the recipe is valid.
 */
export const validateRecipe = (recipe) => {
  const errors = {};
  if (!recipe.title || recipe.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }
  if (!recipe.ingredients || recipe.ingredients.length < 10) {
    errors.ingredients = 'Ingredients must be at least 10 characters long';
  }
  if (!recipe.instructions || recipe.instructions.length < 10) {
    errors.instructions = 'Instructions must be at least 10 characters long';
  }
  if (!recipe.prepTime || isNaN(recipe.prepTime) || recipe.prepTime < 1) {
    errors.prepTime = 'Preparation time must be a positive number';
  }
  if (!recipe.category) {
    errors.category = 'Category is required';
  }
  return errors;
};

/**
 * Sanitizes user-provided recipe text fields using DOMPurify
 * to prevent XSS attacks.
 */
export const sanitizeRecipe = (recipe) => {
  return {
    ...recipe,
    title: DOMPurify.sanitize(recipe.title),
    description: DOMPurify.sanitize(recipe.description),
    ingredients: DOMPurify.sanitize(recipe.ingredients),
    instructions: DOMPurify.sanitize(recipe.instructions)
  };
};
