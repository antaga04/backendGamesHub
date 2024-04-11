const express = require('express');
const { getAllGames, createGame, updateGameById, deleteGame } = require('../controllers/game');
const uploadFile = require('../../middlewares/uploadFile');
const { hasValidAuthJwt } = require('../../middlewares/authenticated');

const router = express.Router();

router.get('/', getAllGames);
router.post('/', hasValidAuthJwt, uploadFile.single('cover'), createGame);
router.put('/:id', hasValidAuthJwt, uploadFile.single('cover'), updateGameById);
router.delete('/:id', hasValidAuthJwt, deleteGame);

module.exports = router;
