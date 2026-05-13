const Booking = require('../models/Booking');
const User    = require('../models/User');
const geolib  = require('geolib');

// Price algorithm
function calculatePrice(serviceType, distanceKm, isUrgent) {
  const basePrices = {
    'Electrician': 200, 'Plumber': 180,
    'Carpenter':   220, 'AC Repair': 350,
    'Painter':     150, 'Cleaning': 120,
  };
  const base     = basePrices[serviceType] || 200;
  const distCost = Math.round(distanceKm * 15);
  const urgency  = isUrgent ? 50 : 0;
  const hour     = new Date().getHours();
  const night    = (hour >= 21 || hour < 6) ? 80 : 0;
  const total    = base + distCost + urgency + night;
  return { base, distCost, urgency, night, total };
}

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { serviceType, description, problem, address, isUrgent, customerLat, customerLng } = req.body;

    const technicians = await User.find({
      role: 'technician', serviceType, isAvailable: true
    });

    if (technicians.length === 0) {
      return res.status(404).json({ message: 'No technicians available right now. Try again later!' });
    }

    let nearbyTechs = technicians;
    if (customerLat && customerLng) {
      nearbyTechs = technicians.filter(t => {
        if (!t.lat || !t.lng) return true;
        const dist = geolib.getDistance(
          { latitude: customerLat, longitude: customerLng },
          { latitude: t.lat,       longitude: t.lng }
        );
        return dist <= 20000;
      });
    }

    if (nearbyTechs.length === 0) {
      return res.status(404).json({ message: 'No technicians available nearby. Try again!' });
    }

    let distanceKm = 5;
    if (customerLat && customerLng && nearbyTechs[0].lat) {
      const dist = geolib.getDistance(
        { latitude: customerLat, longitude: customerLng },
        { latitude: nearbyTechs[0].lat, longitude: nearbyTechs[0].lng }
      );
      distanceKm = dist / 1000;
    }

    const price = calculatePrice(serviceType, distanceKm, isUrgent);

    const booking = await Booking.create({
      customer: req.user.id,
      serviceType,
      description,
      problem: problem || '',
      address,
      customerLat,
      customerLng,
      isUrgent: isUrgent || false,
      price: price.total,
      priceBreakdown: price,
      status: 'pending',
      notifiedTechnicians: nearbyTechs.map(t => t._id),
      technician: null
    });

    res.status(201).json({
      message: `Request sent to ${nearbyTechs.length} technicians!`,
      booking, price
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accept booking
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'accepted') {
      return res.status(400).json({ message: 'Sorry! Another technician already accepted this job.' });
    }
    booking.technician = req.user.id;
    booking.status     = 'accepted';
    await booking.save();
    await User.findByIdAndUpdate(req.user.id, { isAvailable: false });
    const populated = await Booking.findById(booking._id)
      .populate('customer',   'name phone')
      .populate('technician', 'name phone serviceType');
    res.json({ message: 'Job accepted!', booking: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject booking
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.notifiedTechnicians = booking.notifiedTechnicians.filter(
      id => id.toString() !== req.user.id.toString()
    );
    if (booking.notifiedTechnicians.length === 0) booking.status = 'rejected';
    await booking.save();
    res.json({ message: 'Booking rejected.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update location
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    await User.findByIdAndUpdate(req.user.id, { lat, lng });
    res.json({ message: 'Location updated!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my bookings
exports.getMyBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'customer') {
      bookings = await Booking.find({ customer: req.user.id })
        .populate('technician', 'name phone serviceType avgRating lat lng')
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({
        notifiedTechnicians: req.user.id,
        status: 'pending'
      })
        .populate('customer', 'name phone')
        .sort({ createdAt: -1 });
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get accepted jobs
exports.getAcceptedJobs = async (req, res) => {
  try {
    const bookings = await Booking.find({
      technician: req.user.id,
      status: 'accepted'
    })
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Complete job
exports.completeJob = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'completed';
    await booking.save();
    await User.findByIdAndUpdate(booking.technician, { isAvailable: true });
    res.json({ message: 'Job completed!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rate booking
exports.rateBooking = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'completed') return res.status(400).json({ message: 'Can only rate completed jobs' });
    if (booking.rating) return res.status(400).json({ message: 'Already rated' });
    if (booking.customer.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    booking.rating  = rating;
    booking.review  = review || '';
    booking.ratedAt = new Date();
    await booking.save();

    // Update technician average rating
    const tech     = await User.findById(booking.technician);
    const allRated = await Booking.find({
      technician: booking.technician,
      rating:     { $ne: null }
    });
    const avg = allRated.reduce((sum, b) => sum + b.rating, 0) / allRated.length;
    await User.findByIdAndUpdate(booking.technician, {
      avgRating:    Math.round(avg * 10) / 10,
      totalRatings: allRated.length
    });

    res.json({ message: 'Rating submitted!', avg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get booking history
exports.getHistory = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'customer') {
      bookings = await Booking.find({
        customer: req.user.id,
        status:   'completed'
      })
        .populate('technician', 'name phone serviceType avgRating')
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({
        technician: req.user.id,
        status:     'completed'
      })
        .populate('customer', 'name phone')
        .sort({ createdAt: -1 });
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Price estimate
exports.getPriceEstimate = async (req, res) => {
  try {
    const { serviceType, isUrgent } = req.query;
    const price = calculatePrice(serviceType, 5, isUrgent === 'true');
    res.json({ price });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};