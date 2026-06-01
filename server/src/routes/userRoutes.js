import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {getUsers} from "../controllers/userController.js";
import {authorize} from "../middleware/roleMiddleware.js";
const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.get("/", protect,
   authorize(
    "Super Admin", 
    "Consultancy Admin"
  ),
   getUsers);

export default router;