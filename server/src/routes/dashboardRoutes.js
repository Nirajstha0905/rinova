import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getDashboardStats,
    getApplicationsByStatus,
    getStudentsByCountry,
    getRecentActivities,
    getUpcomingTasks } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/applications-by-status",protect, getApplicationsByStatus);
router.get("/students-by-country", protect, getStudentsByCountry);
router.get("/recent-activities", protect,getRecentActivities);
router.get("/upcoming-tasks",protect,getUpcomingTasks);

export default router;