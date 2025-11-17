import prisma from '../../../prisma/client';

export async function createStudent(data: any, addedById?: string) {
  const defaultPassword = `Student@${Math.floor(1000 + Math.random() * 9000)}`;
  const student = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      password: defaultPassword,
      role: 'STUDENT',
      approvalStatus: 'APPROVED',
      dob: data.dob ? new Date(data.dob) : undefined,
      department: data.department,
      addedBy: addedById ? { connect: { id: addedById } } : undefined
    }
  });
  return { student: { id: student.id, name: student.name, email: student.email, mobile: student.mobile }, defaultPassword };
}

export async function listStudents(requestingUser: any) {
  if (requestingUser.role === 'ADMIN') {
    return prisma.user.findMany({ where: { role: 'STUDENT' } });
  }
  if (requestingUser.role === 'FACULTY') {
    return prisma.user.findMany({ where: { role: 'STUDENT', addedById: requestingUser.id } });
  }
  if (requestingUser.role === 'STUDENT') {
    return prisma.user.findUnique({ where: { id: requestingUser.id } });
  }
  return [];
}

export async function getStudentById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function updateStudent(id: string, data: any) {
  return prisma.user.update({ where: { id }, data });
}

export async function deleteStudent(id: string) {
  return prisma.user.delete({ where: { id } });
}