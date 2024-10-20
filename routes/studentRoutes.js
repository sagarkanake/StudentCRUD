const express = require('express');
const {
  createStudent,
  updateStudent,
  getStudents,
  fetchStudent,
  deleteStudent,
} = require('../controllers/studentController');

const router = express.Router();
const { celebrate, Joi, errors } = require('celebrate'); // Import Celebrate and Joi
//  Validation schemas
const studentValidationSchema = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        marks: Joi.array()
            .items(
                Joi.object().keys({
                    subject: Joi.string().required(),
                    marks: Joi.number().min(0).max(100).required()
                })
            )
            .max(10) // Limit the marks array to a maximum of 10
            .required()
    })
};

const updateStudentValidationSchema = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    }),
    body: Joi.object().keys({
        student_id: Joi.number().required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        marks: Joi.array()
            .items(
                Joi.object().keys({
                    subject: Joi.string().required(),
                    marks: Joi.number().min(0).max(100).required(),
                    mark_id: Joi.number().min(0).max(100)
                })
            )
            .max(10)
            .required()
    })
};

const idValidationSchema = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    })
};

const paginationValidationSchema = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).required(),
        limit: Joi.number().integer().min(1).max(100).required() // Limit the number of records per page
    })
};
// Define the routes
router.post('/', celebrate(studentValidationSchema) , createStudent);
router.put('/:id',celebrate(updateStudentValidationSchema) ,  updateStudent);
router.get('/', celebrate(paginationValidationSchema) , getStudents);
router.get('/fetch/:id', celebrate(idValidationSchema) ,  fetchStudent);
router.delete('/:id', celebrate(idValidationSchema) , deleteStudent);

module.exports = router;
