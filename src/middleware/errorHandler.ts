// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err?.statusCode || err?.status || 500;
  const message = err?.message || 'Internal Server Error';

  // Optionally log the error here

  res.status(status).json({
    error: status >= 500 ? 'Server Error' : 'Bad Request',
    message,
  });
}