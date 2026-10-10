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


app.use('/api/hms/patients', patientsRoutes);
app.use('/api/hms/billing', billingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});