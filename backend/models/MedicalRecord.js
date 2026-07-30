const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    doctorName: String,
    doctorSpecialization: String,
    type: {
        type: String,
        enum: ['consultation', 'prescription', 'lab', 'imaging', 'surgery', 'vaccination', 'other'],
        default: 'consultation'
    },
    date: {
        type: Date,
        default: Date.now
    },
    diagnosis: String,
    prescription: String,
    notes: String,
    hospitalName: String,
    lab: String,
    result: String,
    files: [{
        filename: String,
        originalName: String,
        path: String,
        mimetype: String,
        size: Number
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'completed'],
        default: 'completed'
    },
    addedBy: {
        type: String,
        enum: ['patient', 'doctor'],
        default: 'patient'
    }
}, {
    timestamps: true
});

// Index for efficient querying
medicalRecordSchema.index({ patient: 1, date: -1 });
medicalRecordSchema.index({ patient: 1, type: 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
