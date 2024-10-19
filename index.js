const express = require('express');
const { connectDB, client } = require('./config/db');
const cors  = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const { celebrate, Joi, errors } = require('celebrate'); // Import Celebrate and Joi
const app = express();
app.use(express.json());

// Connect to the database
connectDB();
app.use(cors()); // include before other routes

// Use student routes
app.use('/api/students', studentRoutes);

// Error handling for Celebrate
// Custom error handler for validation errors
app.use((err, req, res, next) => {
  if (err.joi) {
      // If it's a Joi validation error, format it
      return res.status(400).json({
          message: err.joi.message // Customize to show error message only
      });
  }
  next(err); // Pass other errors to the default error handler
});
app.use(errors()); // This will return the errors from Celebrate
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
