require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Room = require('../models/Room');

const rooms = [
  {
    name: 'Standard Single',
    type: 'Single',
    comfortLevel: 'Basic',
    description: 'A cozy, well-lit single room designed for solo travelers and business guests. Features a comfortable twin bed, a work-friendly desk, and a private bathroom with continuous hot water. Large window offers a pleasant view of the city skyline — perfect for a restful night after a long day.',
    highlights: ['City view', 'Twin bed', 'Work desk', 'Free WiFi'],
    roomSize: '22 m²',
    bedType: 'Twin bed',
    view: 'City view',
    pricePerNight: 1500,
    capacity: 1,
    amenities: ['WiFi', 'AC', 'TV', 'Hot water', 'Room service', 'Work desk', 'Safe box'],
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    totalRooms: 10
  },
  {
    name: 'Double Deluxe',
    type: 'Double',
    comfortLevel: 'Comfort',
    description: 'A spacious double room with modern Ethiopian-inspired decor and warm lighting. Includes a queen bed, work desk, minibar, and a large window overlooking our garden courtyard. Ideal for couples, friends, or business travelers seeking extra comfort.',
    highlights: ['Garden view', 'Queen bed', 'Minibar', 'Free breakfast'],
    roomSize: '35 m²',
    bedType: 'Queen bed',
    view: 'Garden view',
    pricePerNight: 2800,
    capacity: 2,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Work desk', 'Hot water', 'Room service', 'Safe box', 'Breakfast'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    totalRooms: 8
  },
  {
    name: 'Executive Suite',
    type: 'Suite',
    comfortLevel: 'Premium',
    description: 'Luxury suite featuring a separate living room, a king-size bed with premium linens, and a private balcony with panoramic views of Addis Ababa. Includes jacuzzi, complimentary breakfast, and evening cocktail service — a perfect blend of comfort and elegance.',
    highlights: ['Panoramic balcony', 'King bed', 'Jacuzzi', 'Free breakfast'],
    roomSize: '60 m²',
    bedType: 'King bed',
    view: 'Panoramic city view',
    pricePerNight: 5500,
    capacity: 3,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Breakfast', 'Room service', 'Lounge', 'Butler on call'],
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
    totalRooms: 4
  },
  {
    name: 'Presidential Suite',
    type: 'Presidential',
    comfortLevel: 'Luxury',
    description: 'Our finest suite — over 120 m² of pure elegance with 270° panoramic views of Addis Ababa. Features a private pool, dedicated butler, personal chef on request, and a grand lounge for entertaining. Reserved for guests who expect nothing less than perfection.',
    highlights: ['270° Addis view', 'Private pool', 'Butler service', 'Personal chef'],
    roomSize: '120 m²',
    bedType: 'King bed + sofa bed',
    view: '270° panoramic view',
    pricePerNight: 12000,
    capacity: 4,
    amenities: ['WiFi', 'AC', 'TV', 'Private Pool', 'Butler', 'Lounge', 'Chef', 'Spa access', 'Airport pickup', 'Jacuzzi', 'Dining room'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    totalRooms: 1
  }
];

(async () => {
  try {
    await connectDB();
    await Room.deleteMany();
    await Room.insertMany(rooms);
    console.log('✅ Seeded', rooms.length, 'rooms');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
})();