const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/permissionMiddleware');
const {
  getAllPatients,
  registerPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patientsController');

// All routes are protected and authorized via JWT middleware
router.get('/all', verifyToken, checkPermission('patients_registration', 'view'), getAllPatients);
router.post('/register', verifyToken, checkPermission('patients_registration', 'add'), registerPatient);
router.put('/update/:id', verifyToken, checkPermission('patients_registration', 'edit'), updatePatient);
router.delete('/:id', verifyToken, checkPermission('patients_registration', 'delete'), deletePatient);

// Dummy history routes protected with token
router.get('/:id/visit-history', verifyToken, (req, res) => res.json({ success: true, data: [] }));
router.get('/:id/billing-history', verifyToken, (req, res) => res.json({ success: true, data: [] }));
router.get('/:id/pharmacy-history', verifyToken, (req, res) => res.json({ success: true, data: [] }));

module.exports = router;
