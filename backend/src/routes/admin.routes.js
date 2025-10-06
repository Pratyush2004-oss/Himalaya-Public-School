import express from 'express';
import { AuthMiddleware, requireAdmin } from '../middleware/AuthMiddleware.js';
import { getAllUsers, getStudentInfoByUserId, verifyUsers, createBatch, getAllBatchesForAdmin, getAllTeachers, verifyFeePayment, deleteUser, deleteBatch, getStudentInfoByUID, createEvent, changeEventStatus, deleteEvent } from '../controllers/admin.controllers.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();
// auth functions
router.post("/verify-users", AuthMiddleware, requireAdmin, verifyUsers);
router.get("/get-all-the-users", AuthMiddleware, requireAdmin, getAllUsers);
router.post('/get-student-information', AuthMiddleware, requireAdmin, getStudentInfoByUserId);
router.post('/get-student-by-UID', AuthMiddleware, requireAdmin, getStudentInfoByUID)
router.delete('/delete-user/:userId', AuthMiddleware, requireAdmin, deleteUser);
// batch functions
router.post("/create-batch", AuthMiddleware, requireAdmin, createBatch);
router.get("/get-all-batches-for-admin", AuthMiddleware, requireAdmin, getAllBatchesForAdmin);
router.get("/get-all-teachers", AuthMiddleware, requireAdmin, getAllTeachers);
router.delete("/delete-batch/:batchId", AuthMiddleware, requireAdmin, deleteBatch);
// fee functions
router.put("/verify-fee-payment", AuthMiddleware, requireAdmin, verifyFeePayment);

// events function
router.post('/create-event', AuthMiddleware, requireAdmin, upload.single('image'), createEvent);
router.get('/change-event-status/:eventId', AuthMiddleware, requireAdmin, changeEventStatus);
router.delete('/delete-event/:eventId', AuthMiddleware, requireAdmin, deleteEvent);

export default router;