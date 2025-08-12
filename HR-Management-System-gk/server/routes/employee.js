// server/routes/employee.js
const express = require('express');
const router = express.Router();
const { registerEmployee, updateEmployee, deleteEmployee, getEmployees } = require('../controllers/employeeController');
const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/role');

router.post('/', authMiddleware, roleMiddleware(['Admin', 'HR']), registerEmployee);
router.put('/:id', authMiddleware, roleMiddleware(['Admin', 'HR']), updateEmployee);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin', 'HR']), deleteEmployee);
router.get('/', authMiddleware, roleMiddleware(['Admin', 'HR']), getEmployees);

module.exports = router;