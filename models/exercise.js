import mongoose from 'mongoose';

const exerciseSchema = mongoose.Schema({
  code: { type: Number, unique: true },
  category: { type: String },
  description: { type: String },
  mets: { type: Number }
});

export default mongoose.model('Exercise', exerciseSchema);
