import express from 'express';
import { changePassword, checkAdmin, checkAuth, loginUser, registerUser } from '../controllers/auth.controller.js';
import { AuthMiddleware, requireAdmin } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/check-auth", AuthMiddleware, checkAuth);
router.get("/check-admin", AuthMiddleware, requireAdmin, checkAdmin);
router.post('/change-password', AuthMiddleware, changePassword);

export default router;