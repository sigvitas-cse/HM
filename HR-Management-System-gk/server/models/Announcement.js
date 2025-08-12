const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: String,
  message: String,
  targetRoles: [String], // ["all"] or ["employee", "hr"]
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
