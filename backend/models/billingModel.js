const mongoose = require('mongoose');

const billingItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  itemName: { type: String },   
  isCustom: { type: Boolean },
  rate: { type: Number, required: true },
  unit: { type: Number, required: true, default: 1 },
  amount: { type: Number, required: true }
});

const billingSchema = new mongoose.Schema({
  billNo: { type: String, required: true, unique: true },
  patientId: { type: String, required: true },
  patientMongoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  fullName: { type: String, required: true },
  mobileNumber: { type: String },
  gender: { type: String },
  regNo: { type: String },
  age: { type: String },
  drName: { type: String },
  address: { type: String },
  admissionDate: { type: String },
  dischargeDate: { type: String },
  billDate: { type: String, required: true },
  cabinNo: { type: String },
  wardNo: { type: String },
  bedNo: { type: String },
  
  // Line items
  items: [billingItemSchema],

  // Financial calculations
  subTotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  advanced: { type: Number, default: 0 },
  returnAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);