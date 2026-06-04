import express from "express";

import {
    getAcademicRecords,
    getAcademicRecordById,
    createAcademicRecord,
    updateAcademicRecord,
    deleteAcademicRecord,
} from "../controllers/academicRecordController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAcademicRecords);
router.get("/:id", protect, getAcademicRecordById);
router.post("/", protect, createAcademicRecord);
router.put("/:id", protect, updateAcademicRecord);
router.delete("/:id", protect, deleteAcademicRecord);

export default router;