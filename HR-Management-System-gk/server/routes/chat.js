// server/routes/chat.js
const express = require('express');
const router = express.Router();
const { getMessages, getUsers } = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

router.get('/messages', authMiddleware, getMessages);
router.get('/users', authMiddleware, getUsers);

module.exports = router;