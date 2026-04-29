const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use('/api/', limiter);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/activity', require('./routes/activity'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CivicFix API is running', time: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Auto-seed function — ensures admin account always exists
async function autoSeed() {
  try {
    const { seedDatabase } = require('./utils/seed');
    await seedDatabase();
  } catch (e) {
    console.error('Auto-seed error:', e.message);
  }
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ MongoDB Connected:', process.env.MONGODB_URI);
    console.log('💾 Data is stored permanently in MongoDB — no data will be lost on restart.');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   Make sure MongoDB is running. On Windows: net start MongoDB');
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await autoSeed();
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`\n🚀 CivicFix Server running on http://localhost:${PORT}`);
      console.log(`📍 API Health: http://localhost:${PORT}/api/health\n`);
    });
  }
};

startServer();

module.exports = app;
