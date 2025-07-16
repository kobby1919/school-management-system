const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ]
}, { timestamps: true });


module.exports = mongoose.model('Parent', parentSchema);