// server/controllers/holidayController.js
const Holiday = require('../models/Holiday');

const addHoliday = async (req, res) => {
  const { name, date, description } = req.body;
  try {
    const holiday = await Holiday.create({
      name,
      date: new Date(date),
      description,
      createdBy: req.user._id,
    });
    res.status(201).json({ message: 'Holiday added', holiday });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add holiday' });
  }
};

const updateHoliday = async (req, res) => {
  const { id } = req.params;
  const { name, date, description } = req.body;
  try {
    const holiday = await Holiday.findByIdAndUpdate(
      id,
      { name, date: new Date(date), description, updatedAt: new Date() },
      { new: true }
    );
    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }
    res.json({ message: 'Holiday updated', holiday });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update holiday' });
  }
};

const deleteHoliday = async (req, res) => {
  const { id } = req.params;
  try {
    const holiday = await Holiday.findByIdAndDelete(id);
    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }
    res.json({ message: 'Holiday deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete holiday' });
  }
};

const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 }).populate('createdBy', 'name');
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch holidays' });
  }
};
module.exports = { addHoliday, updateHoliday, deleteHoliday, getHolidays };
