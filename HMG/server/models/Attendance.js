// server/models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loginTime: { type: Date, required: true },
  logoutTime: { type: Date },
  loginLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  isOutsideOffice: { type: Boolean, default: false },
  workHours: { type: Number }, // Calculated in hours (e.g., 8.5)
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['Present', 'Late', 'Incomplete'], default: 'Present' },
});

module.exports = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);