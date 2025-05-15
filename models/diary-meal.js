import mongoose from "mongoose";
const { Schema } = mongoose;

const diaryMealSchema = new Schema({
  image: { type: String },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  servings: { type: Number },
  served: { type: Number },
  measurementUnit: { type: String, required: true },
  nutrients: {
    calories: { type: Number, required: true },
    macronutrients: [{
      _id: false,
      key: { type: String },
      name: { type: String },
      percentageOfTotal: { type: Number },
      unitOfMeasurement: { type: String },
      value: { type: Number },
      dailyLimit: { type: Number }
    }],
    micronutrients: [{
      _id: false,
      key: { type: String },
      name: { type: String },
      percentageOfTotal: { type: Number },
      unitOfMeasurement: { type: String },
      value: { type: Number },
      dailyLimit: { type: Number }
    }]
  },
  day: { type: Date, required: true },
  mealType: { type: String, required: true },
  recipe: { type: Schema.Types.ObjectId, ref: "Recipe" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("DiaryMeal", diaryMealSchema);
