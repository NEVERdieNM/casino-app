const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth, requireRole(['admin']));

router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.get('/transactions', adminController.getAllTransactions);
router.get('/games', adminController.getAllGames);
router.post('/games', adminController.createGame);
router.put('/games/:id', adminController.updateGame);
router.get('/stats', adminController.getStats);

module.exports = router;