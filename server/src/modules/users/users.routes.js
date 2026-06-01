import express from 'express';
import auth from '../../middleware/auth.js';
import requireRole from '../../middleware/role.js';
import { ROLES } from '../../utils/roles.js';
import { deactivateUser, getUser, listUsers } from './users.controller.js';

const router = express.Router();

router.use(auth);
router.use(requireRole(ROLES.ADMIN));

router.get('/', listUsers);
router.get('/:id', getUser);
router.patch('/:id/deactivate', deactivateUser);

export default router;
