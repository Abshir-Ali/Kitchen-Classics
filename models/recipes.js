
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String }],
  instructions: { type: String, required: true },
  cookTime: { type: String, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;