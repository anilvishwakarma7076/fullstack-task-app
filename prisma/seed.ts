import prisma from '../prisma/client';
import bcrypt from 'bcrypt';

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: process.env.ADMIN_EMAIL || 'admin@school.com' } });
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@school.com',
        mobile: process.env.ADMIN_MOBILE || '9999999999',
        password: hashed,
        role: 'ADMIN',
        approvalStatus: 'APPROVED'
      }
    });
    console.log('Admin user created');
  } else {
    console.log('Admin already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });