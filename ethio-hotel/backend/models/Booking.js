const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  
  paymentMethod: { 
    type: String, 
    enum: ['chapa', 'telebirr', 'cbe', 'awash', 'abyssinia', 'dashen', 'cbebirr', 'cash'], 
    default: 'chapa' 
  },
  
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  transactionId: String,
  receiptUrl: String, 
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  receiptNumber: String,
  extraServices: [{
    serviceName: String,
    price: Number,
    quantity: { type: Number, default: 1 }
  }],
  
  // THESE TWO LINES WERE MISSING AND CAUSING THE ERROR
  cashReceivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
  assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],
  
  specialRequests: String,
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate receipt number
bookingSchema.pre('save', function () {
  if (!this.receiptNumber) {
    this.receiptNumber = 'RCP-' + Date.now().toString(36).toUpperCase() +
      '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  }
});

module.exports = mongoose.model('Booking', bookingSchema);