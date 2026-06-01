import express from 'express';
import auth from '../../middleware/auth.js';
import requireRole from '../../middleware/role.js';
import upload from '../../middleware/upload.js';
import { ROLES } from '../../utils/roles.js';
import { deleteFile, listFiles, uploadFile } from './files.controller.js';

const router = express.Router();

router.use(auth);

router.get('/', listFiles);
router.post('/upload', requireRole(ROLES.ADMIN, ROLES.STAFF, ROLES.AGENT), upload.single('file'), uploadFile);
router.delete('/:id', requireRole(ROLES.ADMIN, ROLES.STAFF), deleteFile);

export default router;
