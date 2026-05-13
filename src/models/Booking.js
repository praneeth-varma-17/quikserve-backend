const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technician:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  notifiedTechnicians: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  serviceType:         { type: String, required: true },
  description:         { type: String, required: true },
  problem:             { type: String, default: '' },
  address:             { type: String, required: true },
  customerLat:         { type: Number, default: null },
  customerLng:         { type: Number, default: null },
  isUrgent:            { type: Boolean, default: false },
  price:               { type: Number, default: 0 },
  priceBreakdown:      { type: Object, default: {} },
  status:              { type: String, enum: ['pending','accepted','rejected','completed'], default: 'pending' },
  rating:              { type: Number, default: null },
  review:              { type: String, default: '' },
  ratedAt:             { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);