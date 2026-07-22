import express from 'express';
import cors from 'cors';

export function createApp() {
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
