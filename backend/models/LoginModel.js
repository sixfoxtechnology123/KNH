const mongoose = require('mongoose');

const loginModelSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Admin' },
  permissions: {
    patients_registration: {
      view: { type: Boolean, default: true },
      add: { type: Boolean, default: true },
      edit: { type: Boolean, default: true },
      delete: { type: Boolean, default: true }
    },
    patients_billing: {
      view: { type: Boolean, default: true },
      add: { type: Boolean, default: true },
      edit: { type: Boolean, default: true },
      delete: { type: Boolean, default: true }
    },
    admin_controller: {
      view: { type: Boolean, default: true },
      add: { type: Boolean, default: true },
      edit: { type: Boolean, default: true },
      delete: { type: Boolean, default: true }
    },
    activity_history: {
      view: { type: Boolean, default: true },
      add: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('LoginUser', loginModelSchema);
