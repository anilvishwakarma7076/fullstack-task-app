import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import prisma from '../../prisma/client';

export interface AuthRequest extends Request {
  user?: any;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const token = auth.split(' ')[1];
  const payload = verifyJwt<any>(token);
  if (!payload) return res.status(401).json({ success: false, message: 'Invalid token' });

  // ensure session is active
  const session = await prisma.session.findUnique({ where: { token } });
  if (!session || !session.isActive) return res.status(401).json({ success: false, message: 'Session invalid' });

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) return res.status(401).json({ success: false, message: 'User not found' });
  req.user = { id: user.id, role: user.role };
  next();
}