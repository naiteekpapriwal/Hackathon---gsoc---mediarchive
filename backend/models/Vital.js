const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    type: {
        type: String,
        enum: ['blood_pressure', 'blood_sugar', 'heart_rate', 'temperature', 'oxygen_saturation', 'weight'],
        required: true
    },
    value: {
        type: String,
        required: true
    },
    unit: String,
    measuredAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['normal', 'elevated', 'low', 'critical'],
        default: 'normal'
    },
    notes: String
}, {
    timestamps: true
});

vitalSchema.index({ patient: 1, type: 1, measuredAt: -1 });

module.exports = mongoose.model('Vital', vitalSchema);
