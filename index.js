require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'nodejs-ecs-test';
const APP_SECRET = process.env.APP_SECRET

app.use(express.json());

// Health check endpoint (important for ECS)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/secret', (req, res) => {
  res.json({
    secret: APP_SECRET,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Node.js on ECS! this the new update',
    app: APP_NAME,
    environment: ENV,
    version: '1.0.0'
  });
});


// Example API endpoint
app.get('/api/info', (req, res) => {
  res.json({
    app: APP_NAME,
    environment: ENV,
    port: PORT,
    nodeVersion: process.version,
    platform: process.platform,
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
    }
  });
});

// Example POST endpoint
app.post('/api/echo', (req, res) => {
  res.json({
    message: 'Echo endpoint',
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${ENV}`);
  console.log(`App Name: ${APP_NAME}`);
});
