const express = require('express');
const { registerUser, loginUser, updateUser, updateUserAvatar } = require('../controllers/user');
const { hasValidAuthJwt } = require('../../middlewares/authenticated');
const uploadFile = require('../../middlewares/uploadFile');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/', hasValidAuthJwt, updateUser);
router.put('/avatar', hasValidAuthJwt, uploadFile.single('avatar'), updateUserAvatar);

module.exports = router;
