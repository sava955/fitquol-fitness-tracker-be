const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const diaryExerciseProgramSchema = Schema({
  days: [{ type: String, required: true }],
  plannerType: { type: String, required: true },
  exercises: [{ type: Schema.Types.ObjectId, ref: "DiaryExercise" }],
  diaries: [{ type: Schema.Types.ObjectId, ref: "Diary" }]
});

module.exports = mongoose.model('DiaryExerciseProgram', diaryExerciseProgramSchema);
