const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

const getAttendanceHistory = async (req, res) => {
  console.log('Received request for /api/attendance/history, userId:', req.user._id); // Debug log
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'User not authenticated properly' });
    }
    const history = await Attendance.find({ userId: req.user._id })
      .sort({ date: -1 })
      .populate('userId', 'name email');
    if (!history.length) {
      return res.status(200).json([]); // Return empty array with 200 if no records
    }
    res.json(history);
  } catch (error) {
    console.error('Error in getAttendanceHistory:', error);
    res.status(500).json({ message: 'Failed to fetch attendance history' });
  }
};

const checkWorkHours = async (attendance, user) => {
  if (attendance.logoutTime) {
    const workHours = (attendance.logoutTime - attendance.loginTime) / (1000 * 60 * 60);
    attendance.workHours = workHours;
    if (workHours < 9 || workHours > 10) {
      await sendEmail(
        user.email,
        'Work Hours Alert',
        `Your work hours (${workHours.toFixed(2)} hrs) on ${new Date(attendance.date).toLocaleDateString()} are outside the expected range (9-10 hours).`
      );
      const admin = await User.findOne({ role: 'Admin' });
      await sendEmail(
        admin.email,
        'Employee Work Hours Alert',
        `${user.name} worked ${workHours.toFixed(2)} hours on ${new Date(attendance.date).toLocaleDateString()}.`
      );
    }
    await attendance.save();
  }
};

module.exports = { getAttendanceHistory, checkWorkHours };