import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { getStudentTimeline } from "../controllers/timelineController.js";

const router = express.Router();

router.get("/students/:studentId", protect, getStudentTimeline);

export default router;