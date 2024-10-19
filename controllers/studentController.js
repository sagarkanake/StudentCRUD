// Get all students
const getStudents = (req, res) => {
    res.send('Get all students');
  };
  
  // Create a student
  const createStudent = (req, res) => {
    res.send('Create a student');
  };
  
  module.exports = { getStudents, createStudent };
  