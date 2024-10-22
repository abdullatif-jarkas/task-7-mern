const mongoose = require("mongoose");

const Video = mongoose.model("Video", new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  }
}, {
  timestamps: true,
}));

module.exports = Video;