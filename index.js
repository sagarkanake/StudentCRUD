const express = require('express');
const { connectDB, client } = require('./config/db');
const cors  = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const app = express();
app.use(express.json());

// Connect to the database
connectDB();
app.use(cors()); // include before other routes

// Use student routes
app.use('/api/students', studentRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
