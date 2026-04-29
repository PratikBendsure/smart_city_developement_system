const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, default: 'Municipal Officer' },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

const ComplaintSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        unique: true,
        default: () => 'CF-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // allow anonymous
    },
    reporterName: { type: String, default: 'Anonymous' },
    reporterPhone: { type: String },

    // Issue details
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'water_supply', 'waste_management', 'road_infrastructure',
            'health_services', 'education_facility', 'parks_recreation',
            'fire_emergency', 'sanitation_hygiene', 'encroachment'
        ]
    },
    title: { type: String, required: [true, 'Title is required'], maxlength: 200 },
    description: { type: String, maxlength: 1000 },

    // Location
    location: {
        address: { type: String, required: [true, 'Location is required'] },
        ward: { type: String },
        city: { type: String, default: 'Mumbai' },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },

    // Media
    imageUrl: { type: String },
    imagePublicId: { type: String },

    // AI Analysis
    aiAnalysis: {
        category: { type: String },
        confidence: { type: Number, default: 0 },
        severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
        description: { type: String },
        suggestedTitle: { type: String },
        processingTime: { type: Number }
    },

    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'resolved', 'rejected', 'escalated'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },

    // Assignment
    assignedTo: { type: String },
    assignedDepartment: { type: String },

    // Upvotes
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Timeline
    comments: [CommentSchema],
    statusHistory: [{
        status: String,
        updatedBy: String,
        note: String,
        timestamp: { type: Date, default: Date.now }
    }],

    // Resolution
    resolvedAt: { type: Date },
    resolutionNote: { type: String },
    beforeImage: { type: String },
    afterImage: { type: String },

    // 24hr target
    targetResolutionAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    },

    isPublic: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
}, { timestamps: true });

// Index for faster queries
ComplaintSchema.index({ trackingId: 1 });
ComplaintSchema.index({ status: 1, category: 1 });
ComplaintSchema.index({ 'location.city': 1 });
ComplaintSchema.index({ createdAt: -1 });
ComplaintSchema.index({ userId: 1 });

module.exports = mongoose.model('Complaint', ComplaintSchema);
