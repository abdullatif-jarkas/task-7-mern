const mongoose = require("mongoose");

const Comment = mongoose.model("Comment", new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  video_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {
  timestamps: true,
}));

module.exports = Comment;