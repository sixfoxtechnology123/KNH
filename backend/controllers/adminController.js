const bcrypt = require('bcryptjs');
const LoginModel = require('../models/LoginModel');
const ActivityHistory = require('../models/activityHistoryModel');

const toAdminUser = (user) => ({
  _id: user._id,
  name: user.name || '',
  userId: user.username,
  role: user.role || '',
  permissions: user.permissions || {},
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const logAdminActivity = async (req, action, description, recordId) => {
  try {
    await ActivityHistory.create({
      userId: req.user?.id,
      username: req.user?.username || 'Unknown',
      role: req.user?.role || '',
      module: 'Admin Controller',
      action,
      description,
      recordId: recordId || '',
      recordType: 'LoginUser',
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });
  } catch (error) {
    console.error('Admin activity log error:', error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await LoginModel.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users.map(toAdminUser) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load admin users.' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, userId, password, role, permissions } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ success: false, message: 'User ID and password are required.' });
    }

    const exists = await LoginModel.findOne({ username: userId });
    if (exists) {
      return res.status(409).json({ success: false, message: 'User ID already exists.' });
    }

    let cleanedPermissions = {};
    if (permissions) {
      for (let key in permissions) {
        if (permissions[key] && permissions[key].view === true) {
          cleanedPermissions[key] = permissions[key];
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await LoginModel.create({ name, username: userId, password: hashedPassword, role: role || 'Staff', permissions: cleanedPermissions });
    await logAdminActivity(req, 'Create', `Created admin user ${userId}`, user._id.toString());

    res.status(201).json({ success: true, data: toAdminUser(user) });
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({ success: false, message: 'Failed to create admin user.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, userId, password, role, permissions } = req.body;

    let cleanedPermissions = {};
    if (permissions) {
      for (let key in permissions) {
        if (permissions[key] && permissions[key].view === true) {
          cleanedPermissions[key] = permissions[key];
        }
      }
    }

    const updateData = { name, username: userId, role, permissions: cleanedPermissions };

    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await LoginModel.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin user not found.' });
    }

    await logAdminActivity(req, 'Update', `Updated admin user ${user.username}`, user._id.toString());
    res.status(200).json({ success: true, data: toAdminUser(user) });
  } catch (error) {
    console.error('Update admin user error:', error);
    res.status(500).json({ success: false, message: 'Failed to update admin user.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await LoginModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin user not found.' });
    }

    await logAdminActivity(req, 'Delete', `Deleted admin user ${user.username}`, user._id.toString());
    res.status(200).json({ success: true, message: 'Admin user deleted successfully.' });
  } catch (error) {
    console.error('Delete admin user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete admin user.' });
  }
};
