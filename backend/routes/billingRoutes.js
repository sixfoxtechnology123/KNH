const express = require('express');
const router = express.Router();
const { 
  createBilling, 
  getAllBills, 
  updateBilling, 
  deleteBilling 
} = require('../controllers/billingController');
const verifyToken = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/permissionMiddleware');

// POST /hms/billing/create
router.post('/create', verifyToken, checkPermission('patients_billing', 'add'), createBilling);

// GET /hms/billing/all (or /hms/billing/bills)
router.get('/all', verifyToken, checkPermission('patients_billing', 'view'), getAllBills);
router.get('/bills', verifyToken, checkPermission('patients_billing', 'view'), getAllBills);

// PUT /hms/billing/update/:id
router.put('/update/:id', verifyToken, checkPermission('patients_billing', 'edit'), updateBilling);

// DELETE /hms/billing/delete/:id
router.delete('/delete/:id', verifyToken, checkPermission('patients_billing', 'delete'), deleteBilling);

module.exports = router;
