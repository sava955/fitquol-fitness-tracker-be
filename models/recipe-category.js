import mongoose from "mongoose";
const { Schema } = mongoose;

const recipeCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
});

const RecipeCategory = mongoose.model("RecipeCategory", recipeCategorySchema);

export default RecipeCategory;
