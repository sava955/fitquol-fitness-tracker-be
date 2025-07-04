import mongoose from "mongoose";
const { Schema } = mongoose;

const nutrientSchema = new Schema({
  _id: false,
  key: { type: String },
  name: { type: String },
  percentageOfTotal: { type: Number },
  unitOfMeasurement: { type: String },
  value: { type: Number },
  dailyLimit: { type: Number },
});

const ingredientSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  measurementUnit: { type: String, required: true, default: "g" },
  nutrients: {
    calories: { type: Number, required: true },
    macronutrients: [nutrientSchema],
    micronutrients: [nutrientSchema],
  },
});

const instructionSchema = new Schema({
  step: { type: String },
  description: { type: String },
});

const recipeSchema = new Schema({
  image: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  preparationTime: { type: Number, required: true },
  cookingTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  mealType: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "RecipeCategory" },
  ingredients: [ingredientSchema],
  instructions: [instructionSchema],
  nutrients: {
    calories: { type: Number, required: true },
    carbohydrates: { type: Number },
    net_carbs: { type: Number },
    fiber: { type: Number },
    fats: { type: Number },
    saturated: { type: Number },
    mufa: { type: Number },
    pufa: { type: Number },
    pufa_w6: { type: Number },
    pufa_w3: { type: Number },
    protein: { type: Number },
    vit_a_rae: { type: Number },
    vit_a: { type: Number },
    vit_b1: { type: Number },
    vit_b2: { type: Number },
    vit_b3: { type: Number },
    vit_b5: { type: Number },
    vit_b6: { type: Number },
    vit_b9: { type: Number },
    vit_b12: { type: Number },
    vit_c: { type: Number },
    vit_d: { type: Number },
    vit_e: { type: Number },
    vit_k: { type: Number },
    choline: { type: Number },
    betaine: { type: Number },
    calcium: { type: Number },
    copper: { type: Number },
    fluoride: { type: Number },
    iron: { type: Number },
    magnesium: { type: Number },
    manganese: { type: Number },
    phosphorus: { type: Number },
    potassium: { type: Number },
    selenium: { type: Number },
    sodium: { type: Number },
    zinc: { type: Number },
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
