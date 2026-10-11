const LoginModel = require('../models/LoginModel');

const checkPermission = (moduleKey, actionKey = 'view') => async (req, res, next) => {
  try {
    if (req.user?.role === 'Admin') {
      return next();
    }

    const user = await LoginModel.findById(req.user?.id).select('permissions role');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'Admin' || user.permissions?.[moduleKey]?.[actionKey]) {
      return next();
    }

    return res.status(403).json({ success: false, message: 'You do not have permission for this action.' });
  } catch (error) {
    console.error('Permission check error:', error);
    return res.status(500).json({ success: false, message: 'Permission check failed.' });
  }
};

module.exports = checkPermission;
