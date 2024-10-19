const express = require('express');
const {
  createStudent,
  updateStudent,
  getStudents,
  fetchStudent,
  deleteStudent,
} = require('../controllers/studentController');

const router = express.Router();

// Define the routes
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.get('/', getStudents);
router.get('/fetch/:id', fetchStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
