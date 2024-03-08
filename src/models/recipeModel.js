const mongoose = require('mongoose');

const recipeIngredientSchema = new mongoose.Schema({
  code: String, // e.g., "1ΛΑ0021"
  description: String, // e.g., "ΚΟΛΟΚΥΘΙ ΜΕΤΡΙΟ"
  quantity: Number, // e.g., 13.00
  unit: String, // e.g., "ΚΙΛΟ"
  shelfLife: String, // e.g., "5 ΗΜΕΡΕΣ"
});

const recipeSchema = new mongoose.Schema({
  title: String, // e.g., "ΠΑΤΑΤΕΣ -ΚΟΛΟΚΥΘΙΑ-ΚΑΡΟΤΟ 350γρ ΚΤΨ"
  totalUnits: Number, // e.g., 100
  ingredients: [recipeIngredientSchema],
  packIds: [String],
  owner: String, // Add this line
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
