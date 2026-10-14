const mongoose = require('mongoose');

const itemMasterSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true }, // Auto-generated ID format (e.g. ITEM-1)
  itemName: { type: String, required: true, trim: true },
  rate: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('ItemMaster', itemMasterSchema);