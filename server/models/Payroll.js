// server/models/Payroll.js
const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // e.g., "2025-07"
  baseSalary: { type: Number, required: true },
  overtimeHours: { type: Number, default: 0 },
  overtimePay: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  generatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Processed'], default: 'Pending' },
});

module.exports = mongoose.models.Payroll || mongoose.model('Payroll', payrollSchema);