const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// require('./scheduler/autoAbsent');
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
});



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

app.use('/api/attendance/teacher', require('./routes/teacher/teacherAttendanceRoutes'));

app.use('/api/attendance/student', require('./routes/student/studentAttendanceRoutes'));

app.use('/api/assessments', require('./routes/teacher/assessmentRoutes'));

const adminRoutes = require('./routes/admin/adminRoutes');
app.use('/api/admins', adminRoutes);

app.use('/api/students', require('./routes/student/studentRoutes'));



// {
//   "fullName": "Kwabena Ebo",
//   "gender": "Male",
//   "dateOfBirth": "2011-06-15",
//   "address": "Accra, Ghana",
//   "guardianName": "Mr. Assan",
//   "guardianContact": "0246876212",
//   "admissionNumber": "STU1002",
//   "assignedClass": "68460b1047a7fe8667c7ddc5",
//   "academicHistory": [
//     {
//       "term": "Term 1",
//       "year": "2023/2024",
//       "performance": "Excellent"
//     }
//   ]
// }

// {
//   "class": "684f9b2098d5cf35b2a4c2c1",
//   "term": "Term 1",
//   "schedule": [
//     {
//       "day": "Monday",
//       "subject": "684f9d2a6ad0fc601d45a4a0", // English
//       "startTime": "08:00",
//       "endTime": "09:00",
//       "isBreak": false
//     },
//     {
//       "day": "Monday",
//       "isBreak": true,
//       "startTime": "10:00",
//       "endTime": "10:15"
//     },
//     {
//       "day": "Monday",
//       "subject": "684f9d3a6ad0fc601d45a4a2", // Math
//       "startTime": "10:30",
//       "endTime": "11:30",
//       "isBreak": false
//     },
//     {
//       "day": "Tuesday",
//       "subject": "684f9d4a6ad0fc601d45a4a3", // Science
//       "startTime": "08:00",
//       "endTime": "09:00",
//       "isBreak": false
//     }
//   ]
// }











  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

