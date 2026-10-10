const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getAllPatients,
  registerPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patientsController');

// All routes are protected and authorized via JWT middleware
router.get('/all', verifyToken, getAllPatients);
router.post('/register', verifyToken, registerPatient);
router.put('/update/:id', verifyToken, updatePatient);
router.delete('/:id', verifyToken, deletePatient);

// Dummy history routes protected with token
router.get('/:id/visit-history', verifyToken, (req, res) => res.json({ success: true, data: [] }));
router.get('/:id/billing-history', verifyToken, (req, res) => res.json({ success: true, data: [] }));
router.get('/:id/pharmacy-history', verifyToken, (req, res) => res.json({ success: true, data: [] }));

module.exports = router;