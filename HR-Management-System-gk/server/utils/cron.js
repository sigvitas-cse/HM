// server/utils/cron.js
const cron = require('node-cron');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { sendEmail } = require('../utils/email');

cron.schedule('30 10 * * 1-5', async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const users = await User.find({ role: 'Employee' });
  for (const user of users) {
    const attendance = await Attendance.findOne({ userId: user._id, date: today });
    if (!attendance) {
      await sendEmail(
        user.email,
        'Late Login Alert',
        `You have not logged in by 10:30 AM on ${today.toLocaleDateString()}. Please log in as soon as possible.`
      );
      const admin = await User.findOne({ role: 'Admin' });
      await sendEmail(
        admin.email,
        'Employee Late Login Alert',
        `${user.name} has not logged in by 10:30 AM on ${today.toLocaleDateString()}.`
      );
    }
  }
});