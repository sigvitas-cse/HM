const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loginTime: Date,
  location: {
    lat: Number,
    lng: Number,
    status: { type: String, enum: ["office", "outside"] },
  },
  confirmedOutside: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.LoginLog || mongoose.model("LoginLog", loginLogSchema);
