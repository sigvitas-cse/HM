// server/routes/payroll.js
const express = require('express');
const router = express.Router();
const { createPayroll, updatePayroll, deletePayroll, getPayrolls } = require('../controllers/payrollController');
const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/role');

router.post('/', authMiddleware, roleMiddleware(['Admin', 'HR']), createPayroll);
router.put('/:id', authMiddleware, roleMiddleware(['Admin', 'HR']), updatePayroll);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin', 'HR']), deletePayroll);
router.get('/', authMiddleware, getPayrolls);

module.exports = router;