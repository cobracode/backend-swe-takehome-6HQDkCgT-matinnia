import app from './index'

const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });

// Graceful shutdown configuration
const SHUTDOWN_TIMEOUT = 10000; // 10 seconds
let isShuttingDown = false;

/**
 * Gracefully shuts down the server
 * 1. Stops accepting new connections
 * 2. Waits for ongoing requests to complete
 * 3. Exits the process
 */
function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    console.log(`⚠️  ${signal} received again, forcing immediate shutdown`);
    process.exit(1);
  }

  isShuttingDown = true;
  console.log(`📡 ${signal} received, shutting down gracefully...`);

  // Stop accepting new connections
  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }
    console.log('✅ Server closed, no longer accepting new connections');
  });

  // Force shutdown after timeout
  const forceShutdownTimer = setTimeout(() => {
    console.log('⏰ Shutdown timeout reached, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);

  // Handle ongoing requests
  server.on('close', () => {
    clearTimeout(forceShutdownTimer);
    console.log('✅ All connections closed, shutting down');
    process.exit(0);
  });
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

export default server;