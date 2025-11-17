import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err.stack ?? err.message ?? JSON.stringify(err));
  const status = err.status || 500;
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || []
  };
  res.status(status).json(response);
}