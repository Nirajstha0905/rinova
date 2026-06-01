import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

const getToken = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return req.cookies?.token;
};

const auth = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      throw new ApiError(401, 'Authentication token is required.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.users.findFirst({
      where: {
        id: decoded.sub,
        is_active: true,
      },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new ApiError(401, 'User no longer exists or is inactive.');
    }

    req.user = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.roles?.name,
    };

    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, 'Invalid or expired token.'));
  }
};

export default auth;
