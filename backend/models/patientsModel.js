const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true }, // Format: P1, P2, P3...
  appointmentId: { type: String },
  motherRegNo: { type: String },
  namePrefix: { type: String },
  fullName: { type: String, required: true },
  gender: { type: String },
  dob: { type: Date },
  age: { type: String },
  
  mobileNumber: { type: String },
  alternateMobile: { type: String },
  villageTown: { type: String },
  postOffice: { type: String },
  policeStation: { type: String },
  district: { type: String },
  stateName: { type: String },
  pinCode: { type: String },
  bloodGroup: { type: String },
  department: { type: String },
  emergencyContactName: { type: String },
  emergencyContactNumber: { type: String },
  // Kin Details
  kinName: { type: String },
  kinPhone: { type: String },
  kinRelation: { type: String },
  kinVillageTown: { type: String },
  kinPostOffice: { type: String },
  kinPoliceStation: { type: String },
  kinDistrict: { type: String },
  kinStateName: { type: String },
  kinPinCode: { type: String },
  status: { type: String, default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);