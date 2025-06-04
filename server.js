const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


  
const classRoutes = require('./routes/academic/classRoutes');
app.use('/api/classes', classRoutes);

const subjectRoutes = require('./routes/academic/subjectRoutes');
app.use('/api/subjects', subjectRoutes);

const subjectAllocationRoutes = require('./routes/academic/subjectAllocationRoutes');
app.use('/api/allocations', subjectAllocationRoutes);

const syllabusRoutes = require('./routes/academic/syllabusRoutes');
app.use('/api/syllabus', syllabusRoutes);

const timetableRoutes = require('./routes/academic/timeTableRoutes');
app.use('/api/timetables', timetableRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const teacherRoutes = require('./routes/teacher/teacherRoutes');
app.use('/api/teachers', teacherRoutes);








  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

