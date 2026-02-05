import express from 'express';
import { changePassword, checkAdmin, checkAuth, getEventList, loginUser, registerUser, updateProfile } from '../controllers/auth.controller.js';
import { AuthMiddleware, requireAdmin } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/check-auth", AuthMiddleware, checkAuth);
router.get("/check-admin", AuthMiddleware, requireAdmin, checkAdmin);
router.post('/change-password', AuthMiddleware, changePassword);
router.put('/update-user-profile', AuthMiddleware, updateProfile);
router.get("/get-all-events", getEventList);

export default router;