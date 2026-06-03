import express from "express";

import upload from "../config/multer.js";

import {
    uploadDocument,
    getDocuments,
    getStudentDocuments,
    verifyDocument,
    rejectDocument,
    deleteDocument,
} from "../controllers/documentController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDocuments);

router.get("/student/:studentId", protect, getStudentDocuments);

router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadDocument
);

router.put("/:id/verify", protect, verifyDocument);

router.put("/:id/reject", protect, rejectDocument);

router.delete("/:id", protect, deleteDocument);

export default router;