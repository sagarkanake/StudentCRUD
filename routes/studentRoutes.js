const express = require('express');
const router = express.Router();
const { getStudents, createStudent } = require('../controllers/studentController');

// Get all students
router.get('/', getStudents);

// Create a new student
router.post('/', createStudent);

module.exports = router;
