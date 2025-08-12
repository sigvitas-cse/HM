// server/routes/auth.js
const express = require('express');
const router = express.Router();
const { login, logout, register } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

module.exports = router;