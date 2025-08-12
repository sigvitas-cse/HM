// server/routes/notice.js
const express = require('express');
const router = express.Router();
const { createNotice, updateNotice, deleteNotice, getNotices } = require('../controllers/noticeController');
const { authMiddleware } = require('../middleware/auth');
const { roleMiddleware } = require('../middleware/role');

router.post('/', authMiddleware, roleMiddleware(['Admin', 'HR']), createNotice);
router.put('/:id', authMiddleware, roleMiddleware(['Admin', 'HR']), updateNotice);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin', 'HR']), deleteNotice);
router.get('/', authMiddleware, getNotices);

module.exports = router;