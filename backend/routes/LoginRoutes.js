const express = require('express');
const router = express.Router();
const { loginUser, changePassword } = require('../controllers/LoginController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;
