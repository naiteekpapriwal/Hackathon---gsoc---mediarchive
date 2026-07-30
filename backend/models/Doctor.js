const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    hprId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    specialization: {
        type: String,
        trim: true
    },
    hospital: {
        type: String,
        trim: true
    },
    experience: String,
    qualifications: [String],
    linkedPatients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
