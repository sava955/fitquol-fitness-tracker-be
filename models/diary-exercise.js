const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const diaryExerciseSchema = Schema({
  day: { type: Date, required: true },
  exercise: { type: Schema.Types.ObjectId, ref: "Exercise" },
  sets: { type: Number, required: true, min: 0 },
  setDuration: { type: Number, required: true, min: 1 },
  caloriesBurned: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model('DiaryExercise', diaryExerciseSchema);
