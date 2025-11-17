import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export function permit(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
}