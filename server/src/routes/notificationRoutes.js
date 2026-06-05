import express from "express";

import { 
    getNotifications,
    markAsRead,
    getUnreadCount,
    markAllAsRead} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);
router.get("/unread-count", protect, getUnreadCount);
router.put("/read-all", protect, markAllAsRead);

export default router;