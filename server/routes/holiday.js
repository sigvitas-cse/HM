// server/routes/holiday.js
const express = require('express');
const router = express.Router();
const { addHoliday, updateHoliday, deleteHoliday, getHolidays } = require('../controllers/holidayController');
const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/role');

router.post('/', authMiddleware, roleMiddleware(['Admin', 'HR']), addHoliday);
router.put('/:id', authMiddleware, roleMiddleware(['Admin', 'HR']), updateHoliday);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin', 'HR']), deleteHoliday);
router.get('/', authMiddleware, getHolidays);

module.exports = router;