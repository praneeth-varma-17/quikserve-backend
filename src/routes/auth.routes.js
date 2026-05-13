const router  = require('express').Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const protect = require('../middlewares/auth.middleware');
const User    = require('../models/User');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe);

router.patch('/availability', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isAvailable: req.body.isAvailable });
    res.json({ message: 'Availability updated!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;