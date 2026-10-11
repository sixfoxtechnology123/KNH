const mongoose = require('mongoose');

const activityHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  username: { type: String, default: 'Unknown' },
  role: { type: String, default: '' },
  module: { type: String, required: true },
  action: { type: String, required: true },
  description: { type: String, required: true },
  recordId: { type: String, default: '' },
  recordType: { type: String, default: '' },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ActivityHistory', activityHistorySchema);
