const express = require('express');
const Course = require('../models/Course');
const authMiddleware = require('../middlewares/auth');
const checkIfUserHasCourseAccess = require('../middlewares/checkIfUserHasCourseAccess');
const Video = require('../models/Video');
const router = express.Router();

//* GET all Courses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find().populate('professor', 'name email age');
    res.status(200).json({ messages: "Data recieved successfully", data: courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//* GET a single Course by id
router.get('/:id', authMiddleware, async (req, res) => {  
  try {
    const course = await Course.findById(req.params.id).populate('professor', 'name email age');

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    //^ get all related videos
    const videos = await Video.find({ course_id: req.params.id });

    res.status(200).json({ 
      message: "Course details recieved successfully", 
      data: {
        course: course,
        videos: videos
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//* Add Course
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    if (!title || !description || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //? Check Types
    if (typeof title !== 'string') {
      return res.status(400).json({ message: "Title must be a string" });
    }
    if (typeof description !== 'string') {
      return res.status(400).json({ message: "Description must be a string" });
    }
    // Regular expression to validate hh:mm:ss format with unlimited hours
    const durationPattern = /^(\d+):([0-5][0-9]):([0-5][0-9])$/;
    if (!durationPattern.test(duration)) {
      return res.status(400).json({ message: "Duration must be in the format hh:mm:ss" });
    }

    const newCourse = new Course({
      title: title,
      description: description,
      duration: duration,
      professor: req.user._id,
    })

    await newCourse.save();

    res.status(201).json({ messages: "Course saved successfully", data: newCourse });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//? Edit Course
router.put('/:id', authMiddleware, checkIfUserHasCourseAccess, async (req, res) => {
  try {
    await Course.findById(req.params.id);
  } catch (error) {
    res.status(404).json({ message: 'Course not found' });
  }
  try {
    const course = await Course.findByIdAndUpdate(req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        duration: req.body.duration,
      }, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ message: "Course updated successfully", data: course });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

//! Delete post
router.delete('/:id', authMiddleware, checkIfUserHasCourseAccess, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status('404').json({ message: "Course Not Found!" });
    }
    res.status('200').json({ message: "Course deleted successfully" });
  } catch (error) {
  }
})


module.exports = router