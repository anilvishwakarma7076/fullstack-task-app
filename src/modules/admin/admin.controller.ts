import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { permit } from '../../middlewares/rbac';
import prisma from '../../../prisma/client';

export const adminRouter = Router();

adminRouter.get('/dashboard/stats', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    const totalFaculties = await prisma.user.count({ where: { role: 'FACULTY' } });
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const pendingApprovals = await prisma.user.count({ where: { role: 'FACULTY', approvalStatus: 'PENDING' } });
    const approvedFaculties = await prisma.user.count({ where: { role: 'FACULTY', approvalStatus: 'APPROVED' } });
    res.json({ success: true, data: { totalFaculties, totalStudents, pendingApprovals, approvedFaculties } });
  } catch (err) {
    next(err);
  }
});

adminRouter.get('/faculties/pending', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    const pending = await prisma.user.findMany({ where: { role: 'FACULTY', approvalStatus: 'PENDING' } });
    res.json({ success: true, data: pending });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/faculties/:id/approve', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    const { approvalStatus } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(approvalStatus)) return res.status(400).json({ success: false, message: 'Invalid status' });
    const updated = await prisma.user.update({ where: { id: req.params.id }, data: { approvalStatus } });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

adminRouter.get('/users', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    const role = req.query.role as string | undefined;
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 10), 100);
    const where: any = {};
    if (role) where.role = role;
    const users = await prisma.user.findMany({ where, skip: (page - 1) * limit, take: limit });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

adminRouter.get('/users/:id', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

adminRouter.patch('/users/:id', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    const data = req.body;
    const user = await prisma.user.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/users/:id', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});