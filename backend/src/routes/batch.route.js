import express from "express";
import { addStudentsByTeacher, changeBatchJoiningCode, deleteBatch, deleteStudentFromBatch, getAllBatchesForStudent, getAllBatchesForStudentToJoin, getAllBatchesForTeacher, getAllStudents, getBatchByIdForTeacher, joinBatchByCode, leaveBatch } from "../controllers/batch.controller.js";
import { AuthMiddleware, VerifyStudent, VerifyTeacher } from "../middleware/AuthMiddleware.js";
const router = express.Router();

// routes accessed by teacher
router.post('/add-students-to-batch', AuthMiddleware, VerifyTeacher, addStudentsByTeacher);
router.get('/change-batchJoinig-code', AuthMiddleware, VerifyTeacher, changeBatchJoiningCode);
router.get('/get-all-batches-for-teacher', AuthMiddleware, VerifyTeacher, getAllBatchesForTeacher);
router.get('/get-batch-by-id-for-teacher/:batchId', AuthMiddleware, VerifyTeacher, getBatchByIdForTeacher);
router.get('/get-all-students/:batchId', AuthMiddleware, VerifyTeacher, getAllStudents);
router.delete('/delete-student-from-batch', AuthMiddleware, VerifyTeacher, deleteStudentFromBatch);
router.delete('/delete-batch/:batchId', AuthMiddleware, VerifyTeacher, deleteBatch);
// routes accessed by students
router.get('/get-all-batches-for-student-to-join', AuthMiddleware, VerifyStudent, getAllBatchesForStudentToJoin);
router.get('/get-all-batches-for-students', AuthMiddleware, VerifyStudent, getAllBatchesForStudent);
router.post('/join-batch-by-code', AuthMiddleware, VerifyStudent, joinBatchByCode);
router.post('/leave-batch', AuthMiddleware, VerifyStudent, leaveBatch);
export default router;