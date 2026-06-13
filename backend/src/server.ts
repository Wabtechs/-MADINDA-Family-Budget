import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', app: 'MADINDA Family Budget API' });
});

app.use('/api', routes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`🚀 MADINDA API running on http://localhost:${env.port}`);
});

export default app;
