const Payroll = require('../models/Payroll');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

const createPayroll = async (req, res) => {
  const { userId, salary, deductions, paymentDate } = req.body;
  console.log('Creating payroll with data:', { userId, salary, deductions, paymentDate });
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const baseSalary = parseFloat(salary) || 0;
    const deductionAmount = parseFloat(deductions) || 0;
    const netSalary = baseSalary - deductionAmount;
    const month = new Date(paymentDate).toISOString().slice(0, 7);
    const payroll = await Payroll.create({
      userId,
      month,
      baseSalary,
      deductions: deductionAmount,
      netSalary,
      paymentDate: new Date(paymentDate),
      status: 'Pending',
    });
    console.log('Payroll created:', payroll._id);
    await sendEmail(
      user.email,
      'Payroll Processed',
      `Dear ${user.name},\nYour payroll for ${new Date(paymentDate).toLocaleDateString()} has been processed. Net Salary: $${netSalary}.`
    );
    console.log(`Email sent to ${user.email}`);
    res.status(201).json({ message: 'Payroll created', payroll });
  } catch (error) {
    console.error('Error in createPayroll:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to create payroll', error: error.message });
  }
};

const updatePayroll = async (req, res) => {
  const { id } = req.params;
  const { userId, salary, deductions, paymentDate, status } = req.body;
  console.log('Updating payroll with data:', { id, userId, salary, deductions, paymentDate, status });
  try {
    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    const user = userId ? await User.findById(userId) : await User.findById(payroll.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    payroll.userId = userId || payroll.userId;
    payroll.baseSalary = parseFloat(salary) || payroll.baseSalary;
    payroll.deductions = parseFloat(deductions) || payroll.deductions;
    payroll.netSalary = payroll.baseSalary - payroll.deductions;
    payroll.paymentDate = paymentDate ? new Date(paymentDate) : payroll.paymentDate;
    payroll.status = status || payroll.status;
    payroll.updatedAt = new Date();
    await payroll.save();
    console.log('Payroll updated:', payroll._id);
    res.json({ message: 'Payroll updated', payroll });
  } catch (error) {
    console.error('Error in updatePayroll:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to update payroll' });
  }
};

const deletePayroll = async (req, res) => {
  const { id } = req.params;
  console.log('Deleting payroll with id:', id);
  try {
    const payroll = await Payroll.findByIdAndDelete(id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }
    console.log('Payroll deleted:', id);
    res.json({ message: 'Payroll deleted' });
  } catch (error) {
    console.error('Error in deletePayroll:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to delete payroll' });
  }
};

const getPayrolls = async (req, res) => {
  console.log('Fetching payrolls for user:', req.user._id, 'role:', req.user.role);
  try {
    let query = {};
    if (req.user.role === 'Employee') {
      query = { userId: req.user._id }; // Only show employee's own payrolls
    } // Admin and HR see all (no filter)
    const payrolls = await Payroll.find(query)
      .sort({ paymentDate: -1 })
      .populate('userId', 'name email');
    console.log('Payrolls fetched:', payrolls.length);
    res.json(payrolls);
  } catch (error) {
    console.error('Error in getPayrolls:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch payrolls' });
  }
};

module.exports = { createPayroll, updatePayroll, deletePayroll, getPayrolls };