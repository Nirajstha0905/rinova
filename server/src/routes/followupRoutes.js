import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    getTodayFollowups,
    getOverdueFollowups,
    getFollowupSummary,
} from "../controllers/followupController.js";

const router = express.Router();

router.get("/today", protect, getTodayFollowups);
router.get("/overdue", protect, getOverdueFollowups);
router.get("/summary", protect, getFollowupSummary);

export default router;