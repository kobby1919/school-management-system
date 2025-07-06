const FeeRecord = require('../../models/finance/feeRecord');
const PaymentLog = require('../../models/finance/paymentLog');
const Student = require('../../models/student/student');

// Create or update fee record for a student
exports.createOrUpdateFeeRecord = async (req, res) => {
  try {
    const { student, term, totalDue } = req.body;

    let record = await FeeRecord.findOne({ student, term });

    if (record) {
      record.totalDue = totalDue;
      await record.save();
      return res.status(200).json({ message: 'Fee record updated', record });
    }

    record = new FeeRecord({ student, term, totalDue });
    await record.save();
    res.status(201).json({ message: 'Fee record created', record });
  } catch (error) {
    res.status(500).json({ message: 'Error creating fee record', error });
  }
};


// Create fee records for all students in a class
exports.createFeesForClass = async (req, res) => {
  try {
    const { classId, term, totalDue } = req.body;

    if (!classId || !term || !totalDue) {
      return res.status(400).json({ message: 'classId, term, and totalDue are required' });
    }

    // Get all students in that class
    const students = await Student.find({ assignedClass: classId });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found in this class' });
    }

    let created = 0, skipped = 0;

    for (const student of students) {
      const exists = await FeeRecord.findOne({ student: student._id, term });

      if (exists) {
        skipped++;
        continue;
      }

      const record = new FeeRecord({
        student: student._id,
        term,
        totalDue
      });

      await record.save();
      created++;
    }

    res.status(201).json({
      message: 'Fee records processed',
      created,
      skipped,
      totalStudents: students.length
    });

  } catch (error) {
    res.status(500).json({ message: 'Error creating fee records', error });
  }
};


exports.recordPayment = async (req, res) => {
    try {
      const { student, term, amount, method, reference, date } = req.body;
  
      // Find the student’s fee record
      let feeRecord = await FeeRecord.findOne({ student, term });
  
      if (!feeRecord) {
        return res.status(404).json({ message: 'Fee record not found' });
      }
  
      // Create the payment log
      const payment = new PaymentLog({
        student,
        term,
        amount,
        method,
        reference,
        date,
        recordedBy: req.user._id,
        feeRecord: feeRecord._id
      });
  
      await payment.save();
  
      // Update the fee record total
      feeRecord.amountPaid += amount;
      await feeRecord.save();
  
      res.status(201).json({
        message: 'Payment recorded successfully',
        payment,
        updatedFeeRecord: feeRecord
      });
    } catch (error) {
      res.status(500).json({ message: 'Error recording payment', error });
    }
  };

  exports.getFeeStatusByStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
  
      const records = await FeeRecord.find({ student: studentId }).sort({ term: -1 });
  
      res.status(200).json(records);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching fee status', error });
    }
  };
  

  // GET: Financial Summary for a given term
  exports.getFinanceSummary = async (req, res) => {
    try {
      const { term, classId } = req.query;
  
      if (!term) {
        return res.status(400).json({ message: 'Term is required' });
      }
  
      // Build the query
      const query = { term };
      if (classId) {
        // Get students in this class
        const students = await Student.find({ assignedClass: classId }).select('_id');
        const studentIds = students.map(s => s._id);
        query.student = { $in: studentIds };
      }
  
      const records = await FeeRecord.find(query);
  
      let totalDue = 0;
      let totalPaid = 0;
      let totalBalance = 0;
      let paidCount = 0;
      let partialCount = 0;
      let unpaidCount = 0;
  
      records.forEach(record => {
        totalDue += record.totalDue;
        totalPaid += record.amountPaid;
        totalBalance += record.balance;
  
        if (record.status === 'Paid') paidCount++;
        else if (record.status === 'Partial') partialCount++;
        else unpaidCount++;
      });
  
      res.status(200).json({
        term,
        classFilterApplied: !!classId,
        summary: {
          totalDue,
          totalPaid,
          totalBalance,
          numberOfStudents: records.length,
          statusBreakdown: {
            Paid: paidCount,
            Partial: partialCount,
            Unpaid: unpaidCount
          }
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error generating financial report', error });
    }
  };
  