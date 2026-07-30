const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    abhaId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    healthId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    aadhaar: {
        type: String,
        trim: true
    },
    age: Number,
    dateOfBirth: Date,
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    height: String,
    weight: String,
    city: String,
    state: String,
    allergies: [String],
    chronicConditions: [String],
    emergencyContact: {
        name: String,
        phone: String,
        relation: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);
