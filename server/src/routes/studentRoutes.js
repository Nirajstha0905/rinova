import express from 'express';

import { protect } from '../middleware/authMiddleware.js';
import { getStudentProfile } from "../controllers/studentProfileController.js";
import {
    createStudent,
    getStudent,
    getStudentById,
    updateStudent,
    deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();


router.get('/', getStudent);
router.get("/:id/profile", getStudentProfile);
router.get("/:id", getStudentById);
router.post('/', protect, createStudent);
router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, deleteStudent);




export default router;