const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // ✅ Add this

dotenv.config();

const app = express();

// ✅ Enable CORS with credentials (for cookies)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ Parse JSON and cookies
app.use(express.json());
app.use(cookieParser()); // 👈 Add this before using any routes

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to SmartCp API!');
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/stats', require('./routes/stats'));


// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
