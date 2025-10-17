import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { gameRoutes } from './routes/games';
import { playerRoutes } from './routes/players';
import { leaderboardRoutes } from './routes/leaderboard';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { validationMiddleware } from './middleware/validation';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize metrics if enabled

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging
app.use(morgan('combined'));

// Rate limiter
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
app.use('/games', gameRoutes);
app.use('/players', playerRoutes);
app.use('/leaderboard', leaderboardRoutes);

// API documentation endpoint (Swagger/OpenAPI)

// Metrics endpoint

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Server start has moved to server.ts, as best practice for integration testing, etc.

export default app;