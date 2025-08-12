// server/controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

const getAttendanceHistory = async (req, res) => {
  try {
    const history = await Attendance.find({ userId: req.user._id })
      .sort({ date: -1 })
      .populate('userId', 'name email');
    res.json(history);
  } catch (error) {
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
