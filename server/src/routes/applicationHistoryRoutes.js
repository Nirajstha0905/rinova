import express from "express";

import {
  changeApplicationStage,
  getApplicationHistory,
} from "../controllers/applicationHistoryController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/change-stage", protect, changeApplicationStage);

router.get(
  "/:applicationId",
  protect,
  getApplicationHistory
);

export default router;