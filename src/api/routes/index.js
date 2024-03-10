const express = require('express');
const usersRouter = require('./user');
const scoresRouter = require('./score');
const router = express.Router();

router.use('/users', usersRouter);
router.use('/scores', scoresRouter);

module.exports = router;
