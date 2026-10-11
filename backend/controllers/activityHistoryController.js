const ActivityHistory = require('../models/activityHistoryModel');

const buildUser = (req) => ({
  userId: req.user?.id,
  username: req.user?.username || req.body?.username || 'Unknown',
  role: req.user?.role || req.body?.role || ''
});

const createActivity = async (req, res) => {
  try {
    const { module, action, description, recordId, recordType } = req.body;

    if (!module || !action || !description) {
      return res.status(400).json({ success: false, message: 'Module, action, and description are required.' });
    }

    const activity = await ActivityHistory.create({
      ...buildUser(req),
      module,
      action,
      description,
      recordId: recordId || '',
      recordType: recordType || '',
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ success: false, message: 'Failed to save activity.' });
  }
};

const getActivities = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 200, 500);
    const activities = await ActivityHistory.find().sort({ createdAt: -1 }).limit(limit);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error('Fetch activity error:', error);
    res.status(500).json({ success: false, message: 'Failed to load activity history.' });
  }
};

module.exports = { createActivity, getActivities };
