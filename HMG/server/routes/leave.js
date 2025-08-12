// server/routes/leave.js
const express = require('express');
const router = express.Router();
const { applyLeave, approveLeave, getLeaves } = require('../controllers/leaveController');
const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/role');

router.post('/apply', authMiddleware, applyLeave);
router.put('/approve/:id', authMiddleware, roleMiddleware(['Admin', 'HR']), approveLeave);
router.get('/', authMiddleware, getLeaves);

module.exports = router;