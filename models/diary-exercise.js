import mongoose from 'mongoose';
const { Schema } = mongoose;

const diaryExerciseSchema = new Schema({
  day: { type: Date, required: true },
  exercise: { type: Schema.Types.ObjectId, ref: "Exercise" },
  sets: { type: Number, required: true, min: 0 },
  setDuration: { type: Number, required: true, min: 1 },
  caloriesBurned: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model('DiaryExercise', diaryExerciseSchema);