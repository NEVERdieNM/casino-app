const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const walletRoutes = require('./wallet');
const gameRoutes = require('./game');
const adminRoutes = require('./admin');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/wallet', walletRoutes);
router.use('/games', gameRoutes);
router.use('/admin', adminRoutes);

module.exports = router;