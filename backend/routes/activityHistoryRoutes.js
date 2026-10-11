const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/permissionMiddleware');
const { getActivities } = require('../controllers/activityHistoryController');

router.get('/all', verifyToken, checkPermission('activity_history', 'view'), getActivities);

module.exports = router;
