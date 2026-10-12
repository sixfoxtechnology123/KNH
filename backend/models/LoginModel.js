const mongoose = require('mongoose');

const loginModelSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Admin' },
 permissions: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('LoginUser', loginModelSchema);
