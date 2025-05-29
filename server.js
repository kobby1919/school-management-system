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




  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

