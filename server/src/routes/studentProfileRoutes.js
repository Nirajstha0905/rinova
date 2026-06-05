import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getStudentProfile,
} from "../controllers/studentProfileController.js";

const router = express.Router();

router.get(
  "/:id/profile",
  protect,
  getStudentProfile
);

export default router;