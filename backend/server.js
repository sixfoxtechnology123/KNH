const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const LoginModel = require('./models/LoginModel');

const app = express();
const PORT = process.env.PORT || 5009;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// CHECK IF DB IS BLANK ON SERVER STARTUP AND GENERATE USER
mongoose.connection.once('open', async () => {
  try {
    const userCount = await LoginModel.countDocuments();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('sixfox@2026', 10);
      
      // Store ONLY { ALL: true } in the database for the sixfox user
      const defaultPermissions = {
        ALL: true
      };

      const newUser = await LoginModel.create({
        name: 'Sixfox Technology',
        username: 'sixfox',
        password: hashedPassword,
        role: 'Admin',
        permissions: defaultPermissions
      });

      await ActivityHistory.create({
        userId: newUser._id,
        username: 'sixfox',
        role: 'Admin',
        module: 'Authentication',
        action: 'System Seed',
        description: 'Default developer account (sixfox) generated with ALL permissions on server startup',
        recordId: newUser._id.toString(),
        recordType: 'LoginUser',
        ipAddress: '127.0.0.1',
        userAgent: 'Server Startup Script'
      });

      console.log('Generated user id and password with ALL permissions');
    } else {
      console.log('Userid and password already generated.');
    }
  } catch (err) {
    console.error('Startup seeding error:', err);
  }
});

// Routes
const patientsRoutes = require('./routes/patientsRoutes');
const billingRoutes = require('./routes/billingRoutes');
const loginRoutes = require('./routes/LoginRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const activityHistoryRoutes = require('./routes/activityHistoryRoutes');
const itemMasterRoutes = require('./routes/itemMasterRoutes');

app.use('/hms/patients', patientsRoutes);
app.use('/hms/billing', billingRoutes);
app.use('/auth', loginRoutes); 
app.use('/hms/admin', adminRoutes);
app.use('/hms/activity-history', activityHistoryRoutes);
app.use('/hms/items', itemMasterRoutes);

app.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});