import express from "express";

import {
  getTestScores,
  getTestScoreById,
  createTestScore,
  updateTestScore,
  deleteTestScore,
} from "../controllers/testScoreController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTestScores);
router.get("/:id", protect, getTestScoreById);

router.post("/", protect, createTestScore);
router.put("/:id", protect, updateTestScore);
router.delete("/:id", protect, deleteTestScore);

export default router;