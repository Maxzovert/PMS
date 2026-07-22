const express = require('express');
const cors = require('cors');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'parkar-pms-backend',
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}

module.exports = { createApp };
