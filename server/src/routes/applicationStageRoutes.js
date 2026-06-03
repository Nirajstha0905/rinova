import express from "express";

import {
  getStages,
  createStage,
  updateStage,
  deleteStage,
} from "../controllers/applicationStageController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getStages);
router.post("/", protect, createStage);
router.put("/:id", protect, updateStage);
router.delete("/:id", protect, deleteStage);

export default router;