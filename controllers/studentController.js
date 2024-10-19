const { client } = require('../config/db');

// Function to create a new student with marks
const createStudent = async (req, res) => {
  const { name, email, phone, marks } = req.body;
  try {
    await client.query('BEGIN');

    // Check if email already exists
    const emailCheck = await client.query('SELECT * FROM students WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Insert the new student
    const studentResult = await client.query(
      'INSERT INTO students (name, email , phone) VALUES ($1, $2, $3) RETURNING id',
      [name, email, phone]
    );

    const studentId = studentResult.rows[0].id;

    // Insert marks for the new student
    const marksPromises = marks.map(mark => {
      return client.query(
        'INSERT INTO marks (student_id, subject, marks) VALUES ($1, $2, $3)',
        [studentId, mark.subject, mark.marks]
      );
    });

    await Promise.all(marksPromises);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Student created successfully', studentId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving student with marks:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

// Function to update an existing student
const updateStudent = async (req, res) => {
  const { id } = req.params; // Extract student ID from URL parameters
  const { name, email, phone, marks } = req.body; // Get the updated details from the request body

  try {
    await client.query('BEGIN');

    // Retrieve the current student record
    const currentStudentResult = await client.query('SELECT * FROM students WHERE id = $1', [id]);
    
    // Check if the student exists
    if (currentStudentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const currentStudent = currentStudentResult.rows[0];

    // Only check if the email has changed
    if (currentStudent.email !== email) {
      const emailCheck = await client.query('SELECT * FROM students WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Update the student's details
    await client.query(
      'UPDATE students SET name = $1, email = $2, phone = $3 WHERE id = $4',
      [name, email, phone, id]
    );

    // Delete existing marks for the student
    await client.query('DELETE FROM marks WHERE student_id = $1', [id]);

    // Insert new marks for the student
    const marksPromises = marks.map(mark => {
      return client.query(
        'INSERT INTO marks (student_id, subject, marks) VALUES ($1, $2, $3)',
        [id, mark.subject, mark.marks]
      );
    });

    await Promise.all(marksPromises);

    await client.query('COMMIT');
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

// Function to get all students with pagination
const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await client.query(
      'SELECT * FROM students ORDER BY id DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const totalCountResult = await client.query('SELECT COUNT(*) FROM students');
    const totalCount = parseInt(totalCountResult.rows[0].count);

    res.json({
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      students: result.rows,
    });
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: 'An error occurred while fetching students' });
  }
};

// Function to fetch a single student with marks
const fetchStudent = async (req, res) => {
  const studentId = req.params.id;

  try {
    const result = await client.query(`
      SELECT s.id, s.name, s.phone, s.email, m.subject, m.marks, m.mark_id
      FROM students s
      LEFT JOIN marks m ON s.id = m.student_id
      WHERE s.id = $1
    `, [studentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = {
      student_id: result.rows[0].id,
      name: result.rows[0].name,
      phone: result.rows[0].phone,
      email: result.rows[0].email,
      marks: result.rows.map(row => ({
        subject: row.subject,
        mark_id: row.mark_id,
        marks: row.marks,
      })).filter(mark => mark.subject !== null),
    };

    res.json(student);
  } catch (error) {
    console.error('Error executing query', error.stack);
    res.status(500).json({ error: 'An error occurred while fetching student data' });
  }
};

// Function to delete a student
const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM marks WHERE student_id = $1', [id]);
    await client.query('DELETE FROM students WHERE id = $1', [id]);
    await client.query('COMMIT');
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

module.exports = {
  createStudent,
  updateStudent,
  getStudents,
  fetchStudent,
  deleteStudent,
};
