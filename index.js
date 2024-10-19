const express = require('express');
const { connectDB, client } = require('./config/db');

const app = express();
app.use(express.json());

// Connect to the database
connectDB();

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM students'); // Replace 'students' with your table name
    res.json(result.rows); // Return the rows from the result
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: 'An error occurred while fetching students' });
  }
});

// Create a new student
app.post('/api/students', async (req, res) => {
  const { name, age, email } = req.body;
  try {
    const result = await client.query('INSERT INTO students (name, age, email) VALUES ($1, $2, $3) RETURNING *', [name, age, email]);
    res.status(201).json(result.rows[0]); // Return the newly created student
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: 'An error occurred while creating the student' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
