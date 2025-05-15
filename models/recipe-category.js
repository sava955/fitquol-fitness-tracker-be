const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeCategorySchema = Schema({
  name: { type: String, required: true, unique: true },
  recepes: [{ type: Schema.Types.ObjectId, ref: "Recepe" }]
});

module.exports = mongoose.model("RecipeCategory", recipeCategorySchema);
