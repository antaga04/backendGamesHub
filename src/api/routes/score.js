const express = require('express');
const { getAllScores, createScore, deleteScore } = require('../controllers/score');
const { hasValidAuthJwt } = require('../../middlewares/authenticated');

const router = express.Router();

router.get('/', getAllScores);
router.post('/', hasValidAuthJwt, createScore);
router.delete('/:id', hasValidAuthJwt, deleteScore);

module.exports = router;
