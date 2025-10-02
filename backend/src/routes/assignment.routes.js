import express from 'express';
import { AuthMiddleware, VerifyStudent, VerifyTeacher } from '../middleware/AuthMiddleware.js';
import { createAssignment, deleteAssignment, getAllAssignmentsofToday, getAssignment } from '../controllers/assignment.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();
// routes that teacher can access
router.post("/create-assignment", AuthMiddleware, VerifyTeacher, upload.array('files'), createAssignment);
router.delete('/delete-assignment/:assignmentId', AuthMiddleware, VerifyTeacher, deleteAssignment);

// routes that student can access
router.get("/get-assignment/:batchId", AuthMiddleware, VerifyStudent, getAssignment);
router.get("/get-assignments-of-today", AuthMiddleware, VerifyStudent, getAllAssignmentsofToday);
export default router;