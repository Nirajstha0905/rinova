import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';

const userSelect = {
  id: true,
  full_name: true,
  email: true,
  phone: true,
  is_active: true,
  created_at: true,
  updated_at: true,
  roles: true,
};

export const listUsers = async () => {
  return prisma.users.findMany({
    where: { is_active: true },
    select: userSelect,
    orderBy: { created_at: 'desc' },
  });
};

export const getUserById = async (id) => {
  const user = await prisma.users.findFirst({
    where: { id, is_active: true },
    select: userSelect,
  });

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  return user;
};

export const deactivateUser = async (id) => {
  await getUserById(id);

  return prisma.users.update({
    where: { id },
    data: {
      is_active: false,
      updated_at: new Date(),
    },
    select: userSelect,
  });
};
