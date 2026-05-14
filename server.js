const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',     require('./src/routes/auth.routes'));
app.use('/api/bookings', require('./src/routes/booking.routes'));

// Public stats route
app.get('/api/stats', async (req, res) => {
  try {
    const Booking = require('./src/models/Booking');
    const User    = require('./src/models/User');
    const totalBookings    = await Booking.countDocuments({ status: 'completed' });
    const totalTechnicians = await User.countDocuments({ role: 'technician' });
    const ratedBookings    = await Booking.find({ rating: { $ne: null } });
    const avgRating        = ratedBookings.length
      ? (ratedBookings.reduce((s,b) => s + b.rating, 0) / ratedBookings.length).toFixed(1)
      : 4.8;
    res.json({ totalBookings, totalTechnicians, avgArrival: 18, avgRating: parseFloat(avgRating) });
  } catch(e) {
    res.status(500).json({ message: e.message });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'QUIK-SERVE API is running!' });
});

// Use Railway's PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});