import express from 'express';

import {
    getFollowups,
    getLeadFollowups,
    createFollowup,
    updateFollowup,
    deleteFollowup,
} from '../controllers/leadFollowupController.js';

import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getFollowups);
router.get("/lead/:leadId", protect, getLeadFollowups);
router.post('/', protect, createFollowup);
router.put('/:id', protect, updateFollowup);
router.delete('/:id', protect, deleteFollowup);

export default router;