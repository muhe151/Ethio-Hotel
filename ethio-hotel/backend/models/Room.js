const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'], required: true },
  description: String,
  comfortLevel: { type: String, enum: ['Basic', 'Comfort', 'Premium', 'Luxury'], default: 'Comfort' },
  highlights: [String],
  roomSize: { type: String, default: '30 m²' },
  bedType: { type: String, default: 'Queen bed' },
  view: { type: String, default: 'City view' },
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, default: 2 },
  amenities: [String],
  images: [String],
  totalRooms: { type: Number, default: 1 },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);