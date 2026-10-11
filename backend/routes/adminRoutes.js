const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/permissionMiddleware');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/adminController');

router.get('/users', verifyToken, checkPermission('admin_controller', 'view'), getUsers);
router.post('/user/create', verifyToken, checkPermission('admin_controller', 'add'), createUser);
router.put('/user/update/:id', verifyToken, checkPermission('admin_controller', 'edit'), updateUser);
router.delete('/user/delete/:id', verifyToken, checkPermission('admin_controller', 'delete'), deleteUser);

module.exports = router;
