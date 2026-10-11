const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5009;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
const patientsRoutes = require('./routes/patientsRoutes');
const billingRoutes = require('./routes/billingRoutes');
const loginRoutes = require('./routes/LoginRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const activityHistoryRoutes = require('./routes/activityHistoryRoutes');

app.use('/hms/patients', patientsRoutes);
app.use('/hms/billing', billingRoutes);
app.use('/auth', loginRoutes); 
app.use('/hms/admin', adminRoutes);
app.use('/hms/activity-history', activityHistoryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});
