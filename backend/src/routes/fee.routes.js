import express from 'express';
import { AuthMiddleware, VerifyStudent } from '../middleware/AuthMiddleware.js';
import { feeOrder, getAllFeeOftheCurrentUser, payFee } from '../controllers/fee.controller.js';

const router = express.Router();

router.post("/create-order", AuthMiddleware, VerifyStudent, feeOrder);
router.post("/verify-fee-payment", AuthMiddleware, VerifyStudent, payFee);
router.get("/get-all-fee-list", AuthMiddleware, VerifyStudent, getAllFeeOftheCurrentUser);

export default router;