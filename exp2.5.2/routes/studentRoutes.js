const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { studentValidationRules, validate } = require('../middleware/validation');

/**
 * RESTful Routes for Student Management
 * Mapping routes to CRUD operations
 */

// GET - List all students
// Route: /students (index)
router.get('/', studentController.getAllStudents);

// GET - Search students
// Route: /students/search?query=name
router.get('/search', studentController.searchStudents);

// GET - Show create form
// Route: /students/create
router.get('/create', studentController.getCreateForm);

// POST - Create new student
// Route: POST /students (create)
router.post(
  '/',
  studentValidationRules(),
  validate,
  studentController.createStudent
);

// GET - Show single student
// Route: /students/:id (show)
router.get('/:id', studentController.getStudentById);

// GET - Show edit form
// Route: /students/:id/edit
router.get('/:id/edit', studentController.getEditForm);

// PUT - Update student
// Route: PUT /students/:id (update)
router.put(
  '/:id',
  studentValidationRules(),
  validate,
  studentController.updateStudent
);

// DELETE - Delete student
// Route: DELETE /students/:id (destroy)
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
