import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getOverviewReport } from "../controllers/reportController.js";

const router = express.Router();

router.get(
  "/overview",
  protect,
  getOverviewReport
);

export default router;