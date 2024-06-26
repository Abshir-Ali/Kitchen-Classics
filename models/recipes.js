const moment = require("moment");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String }],
  instructions: { type: String, required: true },
  image: { type: String },
  cookTime: { type: String, default: "0" },
  createdAt: {
    type: String,
    default: () => moment().format("YYYY-MM-DD HH:mm:ss"),
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
