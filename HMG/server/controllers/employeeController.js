// server/controllers/employeeController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/email');

const registerEmployee = async (req, res) => {
  const { email, password, name, role, employeeId, department, designation, phone, address } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or Employee ID already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
      employeeId,
      department,
      designation,
      phone,
      address,
    });
    await sendEmail(
      email,
      'Welcome to HRMS',
      `Dear ${name},\nYour account has been created. Your Employee ID is ${employeeId}. Please log in to access the system.`
    );
    res.status(201).json({ message: 'Employee registered', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register employee' });
  }
};


const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee' });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee' });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: { $ne: 'Admin' } }).select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

module.exports = { registerEmployee, updateEmployee, deleteEmployee, getEmployees };
