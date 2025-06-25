const cron = require('node-cron');
const Teacher = require('../models/Teacher');
const TeacherAttendance = require('../models/teacher/teacherAttendance');

const autoMarkAbsent = async () => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get all teachers
    const allTeachers = await Teacher.find({ role: 'teacher' });

    for (const teacher of allTeachers) {
      // Check if they already marked attendance today
      const hasMarked = await TeacherAttendance.findOne({
        teacher: teacher._id,
        date: { $gte: todayStart, $lte: todayEnd }
      });

      if (!hasMarked) {
        // Auto-mark Absent
        await TeacherAttendance.create({
          teacher: teacher._id,
          status: 'Absent',
          date: new Date()
        });

        console.log(`Marked absent: ${teacher.name}`);
      }
    }
  } catch (error) {
    console.error('Error auto-marking absent teachers:', error);
  }
};

// Schedule job to run at 7:31 AM every weekday (Mon-Fri)
cron.schedule('31 7 * * 1-5', () => {
  console.log('Running auto-mark absent job...');
  autoMarkAbsent();
});

module.exports = autoMarkAbsent;
