const express = require('express');
const router = express.Router();
const { 
  createBilling, 
  getAllBills, 
  updateBilling, 
  deleteBilling 
} = require('../controllers/billingController');

// POST /hms/billing/create
router.post('/create', createBilling);

// GET /hms/billing/all (or /hms/billing/bills)
router.get('/all', getAllBills);
router.get('/bills', getAllBills);

// PUT /hms/billing/update/:id
router.put('/update/:id', updateBilling);

// DELETE /hms/billing/delete/:id
router.delete('/delete/:id', deleteBilling);

module.exports = router;