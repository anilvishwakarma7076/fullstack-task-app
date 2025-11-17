import bcrypt from 'bcrypt';
import prisma from '../../../prisma/client';
import { signJwt } from '../../utils/jwt';

export async function signupFaculty(data: { name: string; email: string; mobile: string; password: string }) {
  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      password: hashed,
      role: 'FACULTY',
      approvalStatus: 'PENDING'
    },
    select: { id: true, name: true, email: true, mobile: true, role: true, approvalStatus: true }
  });
  return user;
}

export async function login(identifier: string, password: string, deviceInfo?: string, ipAddress?: string) {
  const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { mobile: identifier }] } });
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: 'Invalid credentials' };
  if (user.approvalStatus === 'PENDING') throw { status: 403, message: 'Account pending approval' };
  if (user.approvalStatus === 'REJECTED') throw { status: 403, message: 'Account rejected' };

  // expire other sessions for single active session behavior
  await prisma.session.updateMany({ where: { userId: user.id, isActive: true }, data: { isActive: false } });

  const token = signJwt({ id: user.id, role: user.role });
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      deviceInfo,
      ipAddress,
      isActive: true,
      expiresAt
    }
  });

  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
}

export async function logout(token: string) {
  await prisma.session.updateMany({ where: { token: token }, data: { isActive: false } });
}