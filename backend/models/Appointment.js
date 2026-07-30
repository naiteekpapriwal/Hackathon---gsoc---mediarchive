const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
    specialization: String,
    dateTime: {
        type: Date,
        required: true
    },
    endTime: Date,
    duration: {
        type: Number,
        default: 30 // minutes
    },
    location: String,
    type: {
        type: String,
        enum: ['checkup', 'follow-up', 'consultation', 'emergency'],
        default: 'consultation'
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'],
        default: 'upcoming'
    },
    notes: String
}, {
    timestamps: true
});

appointmentSchema.index({ patient: 1, dateTime: 1 });
appointmentSchema.index({ doctor: 1, dateTime: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
