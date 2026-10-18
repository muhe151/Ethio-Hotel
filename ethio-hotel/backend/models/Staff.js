const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ['Receptionist', 'Housekeeper', 'Cleaner', 'Waiter', 'Cook', 'Security', 'Manager', 'Bellboy'],
    default: 'Receptionist'
  },
  phone: String,
  email: String,
  salary: { type: Number, default: 0 },
  shift: { type: String, enum: ['Morning', 'Evening', 'Night', 'Full-time'], default: 'Morning' },
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
  hireDate: { type: Date, default: Date.now },
  assignedRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);