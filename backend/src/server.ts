import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '2.0.0', name: 'MADINDA Family Budget API' });
});

app.use('/api', routes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`🚀 MADINDA v2 API running on http://localhost:${env.port}`);
});

export default app;
