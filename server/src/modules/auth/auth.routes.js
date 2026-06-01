import express from 'express';
import auth from '../../middleware/auth.js';
import { login, logout, me, register } from './auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.post('/logout', auth, logout);

export default router;
