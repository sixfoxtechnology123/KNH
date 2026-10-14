const express = require('express');
const router = express.Router();
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemMasterController');

router.get('/all', getAllItems);
router.post('/register', createItem);
router.put('/update/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;