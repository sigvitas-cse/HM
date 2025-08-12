// server/controllers/payrollController.js
const Payroll = require('../models/Payroll');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

const createPayroll = async (req, res) => {
  const { userId, salary, deductions, paymentDate } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const netPay = salary - deductions;
    const payroll = await Payroll.create({
      userId,
      salary,
      deductions,
      netPay,
      paymentDate: new Date(paymentDate),
    });
    await sendEmail(
      user.email,
      'Payroll Processed',
      `Dear ${user.name},\nYour payroll for ${new Date(paymentDate).toLocaleDateString()} has been processed. Net Pay: $${netPay}.`
    );
    res.status(201).json({ message: 'Payroll created', payroll });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payroll' });
  }
};

const updatePayroll = async (req, res) => {
  const { id } = req.params;
  const { salary, deductions, paymentDate, status } = req.body;
  try {
    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    payroll.salary = salary || payroll.salary;
    payroll.deductions = deductions || payroll.deductions;
    payroll.netPay = (salary || payroll.salary) - (deductions || payroll.deductions);
    payroll.paymentDate = paymentDate ? new Date(paymentDate) : payroll.paymentDate;
    payroll.status = status || payroll.status;
    payroll.updatedAt = new Date();
    await payroll.save();
    res.json({ message: 'Payroll updated', payroll });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payroll' });
  }
};

const deletePayroll = async (req, res) => {
  const { id } = req.params;
  try {
    const payroll = await Payroll.findByIdAndDelete(id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    res.json({ message: 'Payroll deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete payroll' });
  }
};

const getPayrolls = async (req, res) => {
  try {
    const query = req.user.role === 'Employee' ? { userId: req.user._id } : {};
    const payrolls = await Payroll.find(query)
      .sort({ paymentDate: -1 })
      .populate('userId', 'name email');
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payrolls' });
  }
};

module.exports = { createPayroll, updatePayroll, deletePayroll, getPayrolls };