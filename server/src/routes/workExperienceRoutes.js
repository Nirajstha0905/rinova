import express from "express";

import {
    getWorkExperiences,
    getWorkExperienceById,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience} from "../controllers/workExperienceController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWorkExperiences);
router.get("/:id", protect, getWorkExperienceById);
router.post("/", protect, createWorkExperience);
router.put("/:id", protect, updateWorkExperience);
router.delete("/:id", protect, deleteWorkExperience);

export default router;