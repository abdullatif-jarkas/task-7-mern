const express = require('express');
const Video = require('../models/Video');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();


//* GET all Videos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const videos = await Video.find().populate('course_id');
    res.status(200).json({ messages: "Data recieved successfully", data: videos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//* GET a single Video by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('course_id', 'title description duration professor');

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ message: "Video fetched successfully", data: video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//* Add Video
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, course_id } = req.body;

    if (!title || !description || !course_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //? Check Types
    if (typeof title !== 'string') {
      return res.status(400).json({ message: "Title must be a string" });
    }
    if (typeof description !== 'string') {
      return res.status(400).json({ message: "Description must be a string" });
    }
    if (typeof course_id !== 'string') {
      return res.status(400).json({ message: "course_id must be a string" });
    }

    const newVideo = new Video({
      title: title,
      description: description,
      course_id: course_id
    })

    await newVideo.save();

    res.status(201).json({ messages: "Video saved successfully", data: newVideo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//? Edit Video
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await Video.findById(req.params.id);
  } catch (error) {
    res.status(404).json({ message: 'Video not found' });
  }
  try {
    const video = await Video.findByIdAndUpdate(req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        course_id: req.body.course_id,
      }, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ message: "Video updated successfully", data: video});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

//! Delete Video
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status('404').json({ message: "Video Not Found!" });
    }
    res.status('200').json({ message: "Video deleted successfully" });
  } catch (error) {

  }
})


module.exports = router;