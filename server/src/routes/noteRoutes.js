import express from "express";

import {
  getNotes,
  getNotesById,
  createNote,
  deleteNote,
} from "../controllers/noteController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotes);
router.get("/:id", protect, getNotesById);
router.post("/", protect, createNote);
router.delete("/:id", protect, deleteNote);

export default router;