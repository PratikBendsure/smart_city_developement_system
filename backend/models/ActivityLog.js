const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // allow anonymous activity
    },
    userName: { type: String, default: 'Anonymous' },
    userEmail: { type: String },
    action: {
        type: String,
        required: true,
        enum: [
            'login', 'logout', 'register',
            'submit_complaint', 'update_complaint', 'upvote',
            'view_complaint', 'profile_update',
            'admin_status_update', 'admin_view_complaints'
        ]
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: { type: String },
    userAgent: { type: String }
}, { timestamps: true });

// Indexes for fast queries
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
