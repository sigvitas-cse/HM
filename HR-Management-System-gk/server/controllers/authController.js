// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { calculateDistance } = require('../utils/location');
const { checkWorkHours } = require('./attendanceController');

const login = async (req, res) => {
  try {
    const { email, password, latitude, longitude, confirmOutside } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: 'Valid location data required' });
    }

    if (!process.env.OFFICE_LAT || !process.env.OFFICE_LNG) {
      return res.status(500).json({ message: 'Office location not configured' });
    }

    const officeLat = parseFloat(process.env.OFFICE_LAT);
    const officeLng = parseFloat(process.env.OFFICE_LNG);
    if (isNaN(officeLat) || isNaN(officeLng)) {
      return res.status(500).json({ message: 'Invalid office location coordinates' });
    }

    const officeDistance = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      officeLat,
      officeLng
    );
    console.log('Office distance:', officeDistance, 'isOutsideOffice:', officeDistance > 100);
    if (isNaN(officeDistance)) {
      return res.status(500).json({ message: 'Failed to calculate distance' });
    }

    const isOutsideOffice = officeDistance > 100;
    if (isOutsideOffice && !confirmOutside) {
      return res.status(403).json({ message: 'Outside office location. Confirm to proceed.' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role }, // Ensure string ID
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Generated token for user:', { id: user._id.toString(), role: user.role });

    await Attendance.create({
      userId: user._id,
      loginTime: new Date(),
      loginLocation: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
      isOutsideOffice,
      date: new Date().setHours(0, 0, 0, 0),
      status: isOutsideOffice ? 'Late' : 'Present',
    });

    console.log('Login Successful');

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, employeeId, department, designation, phone, address } = req.body;
    if (!name || !email || !password || !role || !employeeId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User or employee ID already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      employeeId,
      department,
      designation,
      phone,
      address,
    });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({ userId: req.user.id, logoutTime: null });
    if (!attendance) {
      return res.status(400).json({ message: 'No active login session found' });
    }
    attendance.logoutTime = new Date();
    await checkWorkHours(attendance, req.user);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    console.log('getMe called with userId:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });
  } catch (error) {
    console.error('GetMe error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { login, register, logout, getMe };