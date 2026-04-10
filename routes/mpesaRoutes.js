// mpesaRoutes.js
const express = require('express');
const router = express.Router();
const { mpesaCallback } = require('../controllers/paymentController.js');

router.post('/callback', mpesaCallback);

export default  router;