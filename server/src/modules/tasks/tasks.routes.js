import express from 'express';
import auth from '../../middleware/auth.js';
import requireRole from '../../middleware/role.js';
import { ROLES } from '../../utils/roles.js';
import { completeTask, createTask, deleteTask, listTasks, updateTask } from './tasks.controller.js';

const router = express.Router();

router.use(auth);

router.get('/', listTasks);
router.post('/', requireRole(ROLES.ADMIN, ROLES.STAFF, ROLES.AGENT), createTask);
router.patch('/:id', requireRole(ROLES.ADMIN, ROLES.STAFF, ROLES.AGENT), updateTask);
router.patch('/:id/complete', requireRole(ROLES.ADMIN, ROLES.STAFF, ROLES.AGENT), completeTask);
router.delete('/:id', requireRole(ROLES.ADMIN, ROLES.STAFF), deleteTask);

export default router;
