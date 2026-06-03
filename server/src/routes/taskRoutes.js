import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);

router.post("/", protect, createTask);

router.put("/:id", protect, updateTask);

router.patch("/:id/complete", protect, completeTask);

router.delete("/:id", protect, deleteTask);

export default router;