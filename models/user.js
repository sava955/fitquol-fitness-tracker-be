import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  goals: [{ type: Schema.Types.ObjectId, ref: "Goal" }],
  role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

const User = mongoose.model("User", userSchema);

export default User;
