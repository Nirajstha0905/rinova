import express from 'express';
import auth from '../../middleware/auth.js';
import requireRole from '../../middleware/role.js';
import { ROLES } from '../../utils/roles.js';
import { createNote, deleteNote, listNotes, updateNote } from './notes.controller.js';

const router = express.Router();

router.use(auth);

router.get('/', listNotes);
router.post('/', requireRole(ROLES.ADMIN, ROLES.STAFF, ROLES.AGENT), createNote);
router.patch('/:id', requireRole(ROLES.ADMIN, ROLES.STAFF, ROLES.AGENT), updateNote);
router.delete('/:id', requireRole(ROLES.ADMIN, ROLES.STAFF), deleteNote);

export default router;
