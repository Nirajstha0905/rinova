import express from "express";

import upload from "../config/multer.js";

import {
    uploadDocument,
    getDocuments,
    getDocumentStats,
    getStudentDocuments,
    verifyDocument,
    rejectDocument,
    deleteDocument,
    downloadDocument,
} from "../controllers/documentController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDocuments);

router.get("/stats", protect, getDocumentStats);

router.get("/student/:studentId", protect, getStudentDocuments);

router.get("/:id/download", protect, downloadDocument);

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
