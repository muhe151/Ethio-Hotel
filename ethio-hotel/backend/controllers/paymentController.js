const axios = require('axios');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

const chapa = axios.create({
  baseURL: process.env.CHAPA_BASE_URL || 'https://api.chapa.co/v1',
  headers: {
    Authorization: 'Bearer ' + process.env.CHAPA_SECRET_KEY,
    'Content-Type': 'application/json'
  }
});

// 1. Initialize Payment
exports.initializePayment = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, selectedFood } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return res.status(400).json({ message: 'Invalid dates' });

    let totalPrice = nights * room.pricePerNight;
    let extraServices = [];

    // Add Food/Services to total price
    if (selectedFood && selectedFood.length > 0) {
      selectedFood.forEach(item => {
        extraServices.push({ serviceName: item.name, price: item.price, quantity: 1 });
        totalPrice += item.price;
      });
    }

    const txRef = 'HOTEL-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex');

    const booking = await Booking.create({
      user: req.user._id, 
      room: room._id, 
      checkIn, 
      checkOut, 
      guests, 
      totalPrice, 
      txRef, 
      paymentMethod: 'chapa', 
      extraServices
    });

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5000';
    
    const response = await chapa.post('/transaction/initialize', {
      amount: totalPrice.toString(),
      currency: 'ETB',
      email: req.user.email,
      first_name: req.user.name.split(' ')[0],
      last_name: req.user.name.split(' ')[1] || 'Guest',
      phone_number: req.user.phone || '0900000000',
      tx_ref: txRef,
      callback_url: baseUrl + '/api/payments/verify/' + txRef,
      return_url: baseUrl + '/payment-success.html?tx_ref=' + txRef,
      customization: { 
        title: 'Ethio Hotel Booking', 
        description: 'Booking for ' + room.name 
      }
    });

    res.json({ success: true, checkoutUrl: response.data.data.checkout_url, txRef, bookingId: booking._id });
  } catch (err) {
    console.error('Payment init error:', err.response ? err.response.data : err.message);
    res.status(500).json({ message: 'Payment init failed', error: err.response ? err.response.data : err.message });
  }
};

// 2. Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { txRef } = req.params;
    const response = await chapa.get('/transaction/verify/' + txRef);
    const data = response.data.data;

    const booking = await Booking.findOne({ txRef });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (data.status === 'success') {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      booking.transactionId = data.reference;
      await booking.save();
      return res.json({ success: true, booking });
    } else {
      booking.paymentStatus = 'failed';
      await booking.save();
      return res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};