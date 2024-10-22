const express = require('express');
const Comment = require('../models/Comment');
const authMiddleware = require('../middlewares/auth');
const checkIfUserHasAccess = require('../middlewares/checkIfUserHasCourseAccess');
const checkIfUserHasCommentAccess = require('../middlewares/checkIfUserHasCommentAccess');

const router = express.Router();


//* GET all Comments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json({ messages: "Data recieved successfully", data: comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//* GET a single Comment by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment fetched successfully", data: comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//* Add Comment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, video_id } = req.body;

    if (!content || !video_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //? Check Types
    if (typeof content !== 'string') {
    return res.status(400).json({ message: "Content must be a string" });
    }
    if (typeof video_id !== 'string') {
    return res.status(400).json({ message: "video_id must be a string" });
    }

    const newComment = new Comment({
      content: content,
      video_id: video_id,
      user_id: req.user._id,
    })

    await newComment.save();

    res.status(201).json({ messages: "Comment saved successfully", data: newComment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//? Edit Comment
router.put('/:id', authMiddleware, checkIfUserHasCommentAccess, async (req, res) => {
  try {
    await Comment.findById(req.params.id);
  } catch (error) {
    res.status(404).json({ message: 'Comment not found' });
  }
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id,
      {
        content: req.body.content,
        video_id: req.body.video_id,
      }, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ message: "Comment updated successfully", data: comment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

//! Delete Comment
router.delete('/:id', authMiddleware, checkIfUserHasCommentAccess, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status('404').json({ message: "Comment Not Found!" });
    }
    res.status('200').json({ message: "Comment deleted successfully" });
  } catch (error) {

  }
})


module.exports = router;