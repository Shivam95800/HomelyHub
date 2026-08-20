import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// CORS Configuration - Permissive for seamless cross-origin communication
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'HomelyHub Backend API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Root API Welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'HomelyHub API',
    status: 'Online',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      bookings: '/api/bookings',
      health: '/api/health',
    },
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 HomelyHub Server is running on port ${PORT}`);
});
