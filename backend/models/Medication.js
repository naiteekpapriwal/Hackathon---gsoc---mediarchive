const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    time: String,
    prescribedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    prescribedByName: String,
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: Date,
    active: {
        type: Boolean,
        default: true
    },
    taken: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

medicationSchema.index({ patient: 1, active: 1 });

module.exports = mongoose.model('Medication', medicationSchema);
