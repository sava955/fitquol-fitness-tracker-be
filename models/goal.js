import mongoose from "mongoose";

const { Schema } = mongoose;

const goalSchema = new Schema({
  fromDate: { type: Date, required: true },
  measurementSystem: { type: String, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  goal: { type: String, required: true },
  weightPerWeek: { type: Number, required: true, default: 0 },
  activityLevel: { type: String, required: true },
  caloriesRequired: { type: Number, required: true },
  macronutrients: {
    calories: { type: Number, required: true },
    carbohydrates: { type: Number, required: true },
    net_carbs: { type: Number, required: true },
    fiber: { type: Number, required: true },
    fats: { type: Number, required: true },
    saturated: { type: Number, required: true },
    mufa: { type: Number, required: true },
    pufa: { type: Number, required: true },
    pufa_w6: { type: Number, required: true },
    pufa_w3: { type: Number, required: true },
    protein: { type: Number, required: true },
  },
  micronutrients: {
    vit_a_rae: { type: Number, required: true },
    vit_a: { type: Number, required: true },
    vit_c: { type: Number, required: true },
    vit_d: { type: Number, required: true },
    vit_e: { type: Number, required: true },
    vit_k: { type: Number, required: true },
    vit_b1: { type: Number, required: true },
    vit_b2: { type: Number, required: true },
    vit_b3: { type: Number, required: true },
    vit_b5: { type: Number, required: true },
    vit_b6: { type: Number, required: true },
    vit_b9: { type: Number, required: true },
    vit_b12: { type: Number, required: true },
    choline: { type: Number, required: true },
    betaine: { type: Number, required: true },
    calcium: { type: Number, required: true },
    copper: { type: Number, required: true },
    fluoride: { type: Number, required: true },
    iron: { type: Number, required: true },
    magnesium: { type: Number, required: true },
    manganese: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    selenium: { type: Number, required: true },
    sodium: { type: Number, required: true },
    zinc: { type: Number, required: true },
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
