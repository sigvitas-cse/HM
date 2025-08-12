// server/controllers/leaveController.js
const Leave = require('../models/Leave');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

const applyLeave = async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  try {
    const leave = await Leave.create({
      userId: req.user._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
    });
    const admin = await User.findOne({ role: 'Admin' });
    await sendEmail(
      admin.email,
      'New Leave Request',
      `${req.user.name} has applied for leave from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}. Reason: ${reason}`
    );
    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply leave' });
  }
};

const approveLeave = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Approved' or 'Rejected'
  try {
    const leave = await Leave.findByIdAndUpdate(
      id,
      { status, approvedBy: req.user._id, approvedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email');
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    await sendEmail(
      leave.userId.email,
      `Leave ${status}`,
      `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been ${status.toLowerCase()}.`
    );
    res.json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process leave' });
  }
};

const getLeaves = async (req, res) => {
  try {
    const query = req.user.role === 'Employee' ? { userId: req.user._id } : {};
    const leaves = await Leave.find(query)
      .sort({ appliedAt: -1 })
      .populate('userId', 'name email')
      .populate('approvedBy', 'name');
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leaves' });
  }
};

module.exports = { applyLeave, approveLeave, getLeaves };
