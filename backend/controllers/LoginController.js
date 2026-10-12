const LoginModel = require('../models/LoginModel');
const ActivityHistory = require('../models/activityHistoryModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const user = await LoginModel.findOne({ username });
    const loginName = user?.username;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Compare submitted password with hashed database password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: loginName, role: user.role },
      process.env.JWT_SECRET || 'sixfox_secret_2026',
      { expiresIn: '7d' }
    );

    await ActivityHistory.create({
      userId: user._id,
      username: loginName,
      role: user.role,
      module: 'Authentication',
      action: 'Login',
      description: `${loginName} logged in`,
      recordId: user._id.toString(),
      recordType: 'User',
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    return res.json({
      success: true,
      token,
      user: { id: user._id, username: loginName, name: user.name, role: user.role, permissions: user.permissions }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All password fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirm password do not match.' });
    }

    const user = await LoginModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Old password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await ActivityHistory.create({
      userId: user._id,
      username: user.username,
      role: user.role,
      module: 'Authentication',
      action: 'Change Password',
      description: `${user.username} changed password`,
      recordId: user._id.toString(),
      recordType: 'User',
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error while changing password.' });
  }
};

module.exports = { loginUser, changePassword };