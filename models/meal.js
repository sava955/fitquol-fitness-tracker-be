import mongoose from "mongoose";

const { Schema } = mongoose;

const mealSchema = new Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  fat: { type: Number, required: true },
  carbohydrates: { type: Number, required: true },
});

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;
