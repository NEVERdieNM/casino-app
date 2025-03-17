const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { auth } = require('../middleware/auth');

router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);
router.post('/:id/session', auth, gameController.startGameSession);
router.put('/:id/session/:sessionId', auth, gameController.updateGameSession);
router.get('/:id/session/:sessionId', auth, gameController.getGameSession);

module.exports = router;