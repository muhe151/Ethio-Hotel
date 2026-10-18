const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
    // ADD THIS:
  extraServices: [{
    serviceName: String,
    price: Number,
    quantity: { type: Number, default: 1 }
  }],
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { 
    type: String, 
    enum: ['chapa', 'telebirr', 'cbe', 'awash', 'abyssinia', 'cash'], 
    default: 'chapa' 
  },
  transactionId: String,
  receiptUrl: String, 
  cashReceivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
  
  // ADDED THIS LINE SO STAFF CAN BE ASSIGNED:
  assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }], 
  
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  receiptNumber: String,
  specialRequests: String,
  createdAt: { type: Date, default: Date.now }
});

bookingSchema.pre('save', function () {
  if (!this.receiptNumber) {
    this.receiptNumber = 'RCP-' + Date.now().toString(36).toUpperCase() +
      '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  }
});

module.exports = mongoose.model('Booking', bookingSchema);