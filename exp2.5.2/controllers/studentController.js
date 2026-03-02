import Student from '../models/Student.js';

/**
 * Controller for Student Management
 * Implements CRUD operations with MVC pattern
 */

// GET - Display all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.render('index', {
      title: 'Student Management System',
      students: students,
      successMessage: req.query.message || null
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).render('error', {
      message: 'Failed to fetch students',
      errors: [error]
    });
  }
};

// GET - Show create student form
const getCreateForm = (req, res) => {
  res.render('create', {
    title: 'Add New Student'
  });
};

// POST - Create a new student
const createStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, course, marks, phone, address, city, state } = req.body;

    // Check if student with same email or roll number already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNumber }]
    });

    if (existingStudent) {
      return res.status(400).render('create', {
        title: 'Add New Student',
        error: 'Student with this email or roll number already exists'
      });
    }

    const student = new Student({
      name,
      email,
      rollNumber,
      course,
      marks: marks || 0,
      phone,
      address,
      city,
      state
    });

    await student.save();
    res.redirect('/?message=Student added successfully');
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).render('create', {
      title: 'Add New Student',
      error: error.message
    });
  }
};

// GET - Show single student details
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).render('error', {
        message: 'Student not found',
        status: 404
      });
    }

    res.render('show', {
      title: 'Student Details',
      student: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).render('error', {
      message: 'Failed to fetch student details',
      errors: [error]
    });
  }
};

// GET - Show edit student form
const getEditForm = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).render('error', {
        message: 'Student not found',
        status: 404
      });
    }

    res.render('edit', {
      title: 'Edit Student',
      student: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).render('error', {
      message: 'Failed to fetch student details',
      errors: [error]
    });
  }
};

// PUT - Update student information
const updateStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, course, marks, phone, address, city, state } = req.body;

    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).render('error', {
        message: 'Student not found',
        status: 404
      });
    }

    // Check if new email or roll number is already taken by another student
    const duplicateCheck = await Student.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        { $or: [{ email }, { rollNumber }] }
      ]
    });

    if (duplicateCheck) {
      return res.status(400).render('edit', {
        title: 'Edit Student',
        student: student,
        error: 'Email or roll number already in use'
      });
    }

    // Update student fields
    student = Object.assign(student, {
      name,
      email,
      rollNumber,
      course,
      marks: marks || 0,
      phone,
      address,
      city,
      state
    });

    await student.save();
    res.redirect(`/students/${student._id}?message=Student updated successfully`);
  } catch (error) {
    console.error('Error updating student:', error);
    const student = await Student.findById(req.params.id);
    res.status(400).render('edit', {
      title: 'Edit Student',
      student: student,
      error: error.message
    });
  }
};

// DELETE - Delete a student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).render('error', {
        message: 'Student not found',
        status: 404
      });
    }

    res.redirect('/?message=Student deleted successfully');
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).render('error', {
      message: 'Failed to delete student',
      errors: [error]
    });
  }
};

// GET - Search students
const searchStudents = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.redirect('/');
    }

    const students = await Student.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { rollNumber: { $regex: query, $options: 'i' } }
      ]
    });

    res.render('index', {
      title: 'Search Results',
      students: students,
      searchQuery: query
    });
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).render('error', {
      message: 'Search failed',
      errors: [error]
    });
  }
};

export {
  getAllStudents,
  getCreateForm,
  createStudent,
  getStudentById,
  getEditForm,
  updateStudent,
  deleteStudent,
  searchStudents
};
