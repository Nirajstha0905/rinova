import express from 'express';
import auth from '../../middleware/auth.js';
import requireRole from '../../middleware/role.js';
import { ROLES } from '../../utils/roles.js';
import {
  createLead,
  deleteLead,
  getLead,
  listLeads,
  restoreLead,
  updateLead,
} from './lead.controller.js';

const router = express.Router();

router.use(auth);

router.get('/', listLeads);
router.post('/', requireRole(ROLES.ADMIN, ROLES.STAFF, ROLES.AGENT), createLead);
router.get('/:id', getLead);
router.patch('/:id', requireRole(ROLES.ADMIN, ROLES.STAFF), updateLead);
router.delete('/:id', requireRole(ROLES.ADMIN, ROLES.STAFF), deleteLead);
router.patch('/:id/restore', requireRole(ROLES.ADMIN), restoreLead);

export default router;
