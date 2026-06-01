import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import { allowedRoles, normalizeRole, ROLES } from '../../utils/roles.js';

const publicUserSelect = {
  id: true,
  full_name: true,
  email: true,
  phone: true,
  is_active: true,
  created_at: true,
  roles: true,
};

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, 'JWT_SECRET is not configured.');
  }

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.roles?.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const ensureRole = async (roleName) => {
  const name = normalizeRole(roleName);

  if (!allowedRoles.includes(name)) {
    throw new ApiError(400, `Role must be one of: ${allowedRoles.join(', ')}.`);
  }

  return prisma.roles.upsert({
    where: { name },
    update: {},
    create: { name },
  });
};

export const register = async ({ full_name, email, phone, password, role = ROLES.STAFF }) => {
  if (!full_name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required.');
  }

  const existingUser = await prisma.users.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const userRole = await ensureRole(role);
  const password_hash = await bcrypt.hash(password, 12);

  const user = await prisma.users.create({
    data: {
      full_name,
      email: email.toLowerCase(),
      phone,
      password_hash,
      role_id: userRole.id,
    },
    select: publicUserSelect,
  });

  return {
    user,
    token: signToken(user),
  };
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const user = await prisma.users.findUnique({
    where: { email: email.toLowerCase() },
    include: { roles: true },
  });

  if (!user || !user.is_active) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const { password_hash, ...safeUser } = user;

  return {
    user: safeUser,
    token: signToken(user),
  };
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.users.findFirst({
    where: {
      id: userId,
      is_active: true,
    },
    select: publicUserSelect,
  });

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  return user;
};
