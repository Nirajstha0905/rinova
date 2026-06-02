import express from 'express';

import {
    getInstitutions,
    getInstitutionById,
    createInstitution,
    updateInstitution,
    deleteInstitution
} from '../controllers/institutionController.js';

import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getInstitutions);
router.get('/:id', protect, getInstitutionById);
router.post('/', protect, createInstitution);
router.put('/:id', protect, updateInstitution);
router.delete('/:id', protect, deleteInstitution);

export default router;