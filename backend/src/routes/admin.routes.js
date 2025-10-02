import express from 'express';
import { AuthMiddleware, requireAdmin } from '../middleware/AuthMiddleware.js';
import { getAllUsers, getStudentInfoByUserId, verifyUsers, createBatch, getAllBatchesForAdmin, getAllTeachers, verifyFeePayment } from '../controllers/admin.controllers.js';

const router = express.Router();
// auth functions
router.post("/verify-users", AuthMiddleware, requireAdmin, verifyUsers);
router.get("/get-all-the-users", AuthMiddleware, requireAdmin, getAllUsers);
router.get('/get-student-information', AuthMiddleware, requireAdmin, getStudentInfoByUserId);

// batch functions
router.post("/create-batch", AuthMiddleware, requireAdmin, createBatch);
router.get("/get-all-batches-for-admin", AuthMiddleware, requireAdmin, getAllBatchesForAdmin);
router.get("/get-all-teachers", AuthMiddleware, requireAdmin, getAllTeachers);

// fee functions
router.post("/verify-fee-payment", AuthMiddleware, requireAdmin, verifyFeePayment);

export default router;