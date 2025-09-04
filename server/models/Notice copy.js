// server/models/Notice.js
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Empty for all users
  postedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.models.Notice || mongoose.model('Notice', noticeSchema);