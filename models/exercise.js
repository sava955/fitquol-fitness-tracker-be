const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
    code: { type: Number, unique: true },
    category: { type: String },
    description: { type: String },
    mets: { type: Number }
});

module.exports = mongoose.model('Exercise', exerciseSchema);