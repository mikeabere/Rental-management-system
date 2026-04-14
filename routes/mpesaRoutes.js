// mpesaRoutes.js
import express from 'express';
const router = express.Router();
import { mpesaCallback } from '../controllers/paymentController.js';

router.post('/callback', mpesaCallback);

export default  router;