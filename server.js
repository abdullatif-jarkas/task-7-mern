/**
 * @advice For Better Comments experience, Download this extension ==> Colorful Comments
 */


const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

//^ Middleware to parse JSON
app.use(express.json());



//* import routes
const videoRoutes = require('./routes/videoRoutes');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');

//* Use routes
app.use('/api/videos', videoRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);

//? handling invalid routes
app.use('*', (req, res) => res.status(400).json({ message: "Invalid API"}))

//& Database Connection
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("Connected to MongoDB");
    //? Start server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => console.error(error));


