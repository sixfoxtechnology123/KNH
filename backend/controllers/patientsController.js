const Patient = require('../models/patientsModel');

// Helper to generate next sequential patient ID: P1, P2, P3...
const generateNextPatientId = async () => {
  const latestPatient = await Patient.findOne().sort({ createdAt: -1 });
  if (!latestPatient || !latestPatient.patientId) {
    return 'P1';
  }
  const numericPart = parseInt(latestPatient.patientId.replace('P', ''), 10) || 0;
  return `P${numericPart + 1}`;
};

// Get All Patients (Authorized)
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Register New Patient (Generates ID strictly upon submit)
exports.registerPatient = async (req, res) => {
  try {
    const patientId = await generateNextPatientId();

    const newPatient = new Patient({
      ...req.body,
      patientId
    });

    const savedPatient = await newPatient.save();
    res.status(201).json({ success: true, data: savedPatient });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update Patient
exports.updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPatient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, data: updatedPatient });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete Patient
exports.deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};