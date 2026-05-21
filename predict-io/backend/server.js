require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');
const predictRoutes = require('./routes/predict');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use('/api', predictRoutes);

// Catch-all for uncaught errors to prevent silent exits
process.on('uncaughtException', (err) => {
    console.error('CRITICAL ERROR:', err.message);
    console.error(err.stack);
});

// Start server with detailed logging
const server = app.listen(PORT, () => {
    console.log(`\n====================================`);
    console.log(`🚀 PREDICT.IO API CORE IS ACTIVE`);
    console.log(`📍 Endpoint: http://localhost:${PORT}/api`);
    console.log(`====================================\n`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ PORT CONFLICT: Port ${PORT} is busy. Try closing other apps.`);
    } else {
        console.error('❌ SERVER CRASH:', err);
    }
    process.exit(1);
});

// Keep process alive
server.keepAliveTimeout = 65000;
