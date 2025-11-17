import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { permit } from '../../middlewares/rbac';
import * as svc from './student.service';
import { createStudentSchema, updateStudentSchema } from './student.validation';

export const studentRouter = Router();

studentRouter.post('/', authenticate, permit('ADMIN', 'FACULTY'), async (req, res, next) => {
  console.log('Create student request body:', req.body);
  try {
    const data = createStudentSchema.parse(req.body);
    const result = await svc.createStudent(data, req.user!.id);
    res.status(201).json({ success: true, message: 'Student created successfully', data: result });
  } catch (err) {
    next(err);
  }
});

studentRouter.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await svc.listStudents(req.user);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

studentRouter.get('/:id', authenticate, async (req, res, next) => {
  try {
    const student = await svc.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Not found' });
    // Authorization: student can see themselves; faculty can see their students; admin all
    if (req.user.role === 'FACULTY' && student.addedById !== req.user.id) return res.status(403).json({ success: false, message: 'Forbidden' });
    if (req.user.role === 'STUDENT' && req.user.id !== student.id) return res.status(403).json({ success: false, message: 'Forbidden' });
    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
});

studentRouter.patch('/:id', authenticate, permit('ADMIN', 'FACULTY'), async (req, res, next) => {
  try {
    const payload = updateStudentSchema.parse(req.body);
    // faculty can only update their own students
    const student = await svc.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Not found' });
    if (req.user.role === 'FACULTY' && student.addedById !== req.user.id) return res.status(403).json({ success: false, message: 'Forbidden' });
    const updated = await svc.updateStudent(req.params.id, payload);
    res.json({ success: true, message: 'Updated', data: updated });
  } catch (err) {
    next(err);
  }
});

studentRouter.delete('/:id', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    await svc.deleteStudent(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});