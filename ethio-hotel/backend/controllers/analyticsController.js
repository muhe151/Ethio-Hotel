const Booking = require('../models/Booking');

exports.getAnalytics = async (req, res) => {
  try {
    const allBookings = await Booking.find({ paymentStatus: 'paid' });

    let totalRevenue = 0;
    let todayRevenue = 0;
    let totalRoomRevenue = 0;
    let totalFoodRevenue = 0;
    let foodSales = {};
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    allBookings.forEach(b => {
      totalRevenue += b.totalPrice;
      if (new Date(b.createdAt) >= today) todayRevenue += b.totalPrice;

      // Calculate Food vs Room Revenue
      let foodTotal = 0;
      if (b.extraServices && b.extraServices.length > 0) {
        b.extraServices.forEach(item => {
          foodTotal += item.price * item.quantity;
          
          if (foodSales[item.serviceName]) foodSales[item.serviceName] += item.price * item.quantity;
          else foodSales[item.serviceName] = item.price * item.quantity;
        });
      }
      
      totalFoodRevenue += foodTotal;
      totalRoomRevenue += (b.totalPrice - foodTotal);
    });

    const topItems = Object.keys(foodSales).map(name => ({
      name, revenue: foodSales[name]
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    res.json({
      totalRevenue, todayRevenue, totalRoomRevenue, totalFoodRevenue,
      totalBookings: allBookings.length, topItems
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};