import app from './app';

const PORT = process.env.PORT || 3000;

// Capture the server instance
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
    server.close(() => {
        console.log('👋 Gracefully shutting down Express server');
        process.exit(0); // Exit the process cleanly
    });
});
