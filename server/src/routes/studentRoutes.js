import express from 'express';

import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

import {
    createStudent,
    getStudent,
    getStudentById,
    updateStudent,
    deleteStudent,
} from "../controllers/studentController.js";

router.get('/', getStudent);
router.get('/:id', getStudentById);
router.post('/', protect, createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);




export default router;