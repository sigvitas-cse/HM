// server/routes/attendance.js
const express = require('express');
const router = express.Router();
const { getAttendanceHistory } = require('../controllers/attendanceController');
const { authMiddleware } = require('../middleware/auth');

router.get('/history', authMiddleware, getAttendanceHistory);

module.exports = router;