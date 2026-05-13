const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  phone:        { type: String, required: true },
  city:         { type: String, required: true },
  role:         { type: String, enum: ['customer','technician'], required: true },
  serviceType:  { type: String, default: null },
  experience:   { type: Number, default: 0 },
  isAvailable:  { type: Boolean, default: true },
  rating:       { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  avgRating:    { type: Number, default: 0 },
  lat:          { type: Number, default: null },
  lng:          { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);