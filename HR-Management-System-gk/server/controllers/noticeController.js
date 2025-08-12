// server/controllers/noticeController.js
const Notice = require('../models/Notice');
const { sendEmail } = require('../utils/email');
const User = require('../models/User');

const createNotice = async (req, res) => {
  const { title, content } = req.body;
  try {
    const notice = await Notice.create({
      title,
      content,
      createdBy: req.user._id,
    });
    // Notify all users via email
    const users = await User.find({});
    const emailPromises = users.map((user) =>
      sendEmail(user.email, `New Notice: ${title}`, content)
    );
    await Promise.all(emailPromises);
    res.status(201).json({ message: 'Notice created', notice });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create notice' });
  }
};

const updateNotice = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    notice.title = title || notice.title;
    notice.content = content || notice.content;
    notice.updatedAt = new Date();
    await notice.save();
    res.json({ message: 'Notice updated', notice });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notice' });
  }
};

const deleteNotice = async (req, res) => {
  const { id } = req.params;
  try {
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete notice' });
  }
};

const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({})
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notices' });
  }
};

module.exports = { createNotice, updateNotice, deleteNotice, getNotices };