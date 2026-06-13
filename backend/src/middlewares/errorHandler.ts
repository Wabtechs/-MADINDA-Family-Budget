import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[Error]', err);

  if (err instanceof AppError) {
    const response: { message: string; status: number; details?: unknown } = {
      message: err.message,
      status: err.status,
    };

    if (err.details !== undefined) {
      response.details = err.details;
    }

    res.status(err.status).json({ error: response });
    return;
  }

  res.status(500).json({
    error: {
      message: process.env.NODE_ENV === 'production'
        ? 'Erreur interne du serveur'
        : err.message,
      status: 500,
    },
  });
};
