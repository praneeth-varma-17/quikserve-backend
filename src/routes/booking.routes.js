const router = require('express').Router();
const {
  createBooking,
  acceptBooking,
  rejectBooking,
  getMyBookings,
  getAcceptedJobs,
  updateLocation,
  getPriceEstimate,
  completeJob,
  rateBooking,
  getHistory
} = require('../controllers/booking.controller');
const protect = require('../middlewares/auth.middleware');

router.get('/estimate',        protect, getPriceEstimate);
router.post('/',               protect, createBooking);
router.get('/mine',            protect, getMyBookings);
router.get('/accepted',        protect, getAcceptedJobs);
router.get('/history',         protect, getHistory);
router.patch('/:id/accept',    protect, acceptBooking);
router.patch('/:id/reject',    protect, rejectBooking);
router.patch('/:id/complete',  protect, completeJob);
router.patch('/:id/rate',      protect, rateBooking);
router.post('/location',       protect, updateLocation);

module.exports = router;