const Leave = require('../models/Leave');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

const applyLeave = async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  console.log('Applying leave with data:', { startDate, endDate, reason });
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Compare only dates (ignore time)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight today
    if (start < today) {
      return res.status(400).json({ message: 'Start date cannot be before today' });
    }
    if (start > end) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }
    const leave = await Leave.create({
      userId: req.user._id,
      startDate: start,
      endDate: end,
      reason,
      status: 'Pending',
    });
    console.log('Leave applied:', leave._id);
    const admins = await User.find({ role: { $in: ['Admin', 'HR'] } }).select('email');
    for (const admin of admins) {
      await sendEmail(
        admin.email,
        'New Leave Request',
        `A new leave request has been submitted by ${req.user._id} from ${startDate} to ${endDate}. Reason: ${reason}`
      );
    }
    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (error) {
    console.error('Error in applyLeave:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to apply leave', error: error.message });
  }
};

const approveLeave = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Approved' or 'Rejected'
  console.log('Approving leave with id:', id, 'status:', status);
  try {
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }
    const leave = await Leave.findByIdAndUpdate(
      id,
      { status, approvedBy: req.user._id, approvedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email');
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave is not pending' });
    }
    await sendEmail(
      leave.userId.email,
      `Leave ${status}`,
      `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been ${status.toLowerCase()}.`
    );
    console.log('Leave processed:', leave._id);
    res.json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (error) {
    console.error('Error in approveLeave:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to process leave', error: error.message });
  }
};

const getLeaves = async (req, res) => {
  console.log('Fetching leaves for user:', req.user._id, 'role:', req.user.role);
  try {
    const query = req.user.role === 'Employee' ? { userId: req.user._id } : {};
    const leaves = await Leave.find(query)
      .sort({ appliedAt: -1 })
      .populate('userId', 'name email')
      .populate('approvedBy', 'name');
    console.log('Leaves fetched:', leaves.length);
    res.json(leaves);
  } catch (error) {
    console.error('Error in getLeaves:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch leaves', error: error.message });
  }
};

module.exports = { applyLeave, approveLeave, getLeaves };