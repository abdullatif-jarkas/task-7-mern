const mongoose = require("mongoose");
const Video = require("./Video");
const Comment = require("./Comment");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
    match: [/^(\d+):([0-5][0-9]):([0-5][0-9])$/, 'Please enter a valid duration in the format hh:mm:ss'],
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

//^ (Middleware) Deleting related videos and comments Before deleting the course
courseSchema.pre('findOneAndDelete', async function (next) {
  const courseId = this._id;

  try {
    //? Find all videos related to the course
    const videos = await Video.find({ course: courseId });

    console.log(videos)
    //! Remove all comments related to each video
    for (const video of videos) {
      await Comment.deleteMany({ video_id: video._id });
    }

    //! Remove all videos related to the course
    await Video.deleteMany({ course: courseId });

    next();
    
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Course", courseSchema);
