const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['citizen', 'admin', 'municipal'],
        default: 'citizen'
    },
    language: {
        type: String,
        enum: ['en', 'hi', 'mr', 'kn', 'ta'],
        default: 'en'
    },
    ward: { type: String },
    city: { type: String, default: 'Mumbai' },
    isActive: { type: Boolean, default: true },
    profilePic: { type: String },
    totalReports: { type: Number, default: 0 },
    resolvedReports: { type: Number, default: 0 },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false }
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
