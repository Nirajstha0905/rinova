import express from "express";

import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  updateApplicationStage,
  deleteApplication,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getApplications);

router.get("/:id", protect, getApplicationById);

router.post("/", protect, createApplication);

router.put("/:id", protect, updateApplication);

router.put("/:id/stage", protect, updateApplicationStage);

router.delete("/:id", protect, deleteApplication);

export default router;