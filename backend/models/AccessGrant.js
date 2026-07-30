const mongoose = require('mongoose');

const accessGrantSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    grantedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'revoked', 'expired'],
        default: 'active'
    },
    reason: String
}, {
    timestamps: true
});

accessGrantSchema.index({ patient: 1, doctor: 1 });
accessGrantSchema.index({ status: 1, expiresAt: 1 });

module.exports = mongoose.model('AccessGrant', accessGrantSchema);
