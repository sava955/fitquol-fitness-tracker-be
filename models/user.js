const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  goals: [{ type: Schema.Types.ObjectId, ref: "Goal" }],
  role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  createdAt: { type: Date, required: true, default: Date.now() }
});

module.exports = mongoose.model("User", userSchema);
