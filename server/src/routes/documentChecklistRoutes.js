import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    getDocumentChecklist,
} from "../controllers/documentChecklistController.js";

const router = express.Router();

router.get(
    "/:id/checklist", protect, getDocumentChecklist
);

export default router;