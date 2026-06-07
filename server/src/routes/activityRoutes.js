import express from "express";
import { getActivities, getRecentActivity } from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getActivities);
router.get("/recent", protect, getActivities);


export default router;