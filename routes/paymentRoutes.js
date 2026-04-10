import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import { initiatePayment } from '../controllers/paymentController.js';

router.post('/initiate', protect, initiatePayment);

export default router;

