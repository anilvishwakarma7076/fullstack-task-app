import { Router } from 'express';
import { signupFaculty, login, logout } from './auth.service';
import { signupSchema, loginSchema } from './auth.validation';
import { authenticate } from '../../middlewares/auth';

export const authRouter = Router();

authRouter.post('/signup', async (req, res, next) => {
    console.log('Signup request body:', req.body);
  try {
    const data = signupSchema.parse(req.body);
    const user = await signupFaculty(data);
    res.status(201).json({ success: true, message: 'Faculty registration successful. Please wait for admin approval.', data: user });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const info = await login(data.identifier, data.password, req.headers['user-agent'] as string, req.ip);
    res.json({ success: true, message: 'Login successful', data: info });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/logout', authenticate, async (req, res, next) => {
  try {
    const auth = req.headers.authorization as string;
    const token = auth.split(' ')[1];
    await logout(token);
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/profile', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    // select non-sensitive user info
    const user = await (await import('../../../prisma/client')).default.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, mobile: true, role: true, approvalStatus: true, department: true, dob: true } });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});