import express from "express";

import {
  getVisaApplications,
  getVisaApplicationById,
  createVisaApplication,
  updateVisaApplication,
  deleteVisaApplication,
} from "../controllers/visaApplicationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getVisaApplications);

router.get("/:id", protect, getVisaApplicationById);

router.post("/", protect, createVisaApplication);

router.put("/:id", protect, updateVisaApplication);

router.delete("/:id", protect, deleteVisaApplication);

export default router;