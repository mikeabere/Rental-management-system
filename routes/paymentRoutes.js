import express from 'express';
const router = express.Router();
const { protect } = require('../middleware/auth');
const { initiatePayment } = require('../controllers/paymentControlle.js');

router.post('/initiate', protect, initiatePayment);
module.exports = router;

// mpesaRoutes.js
const express = require('express');
const router = express.Router();
const { mpesaCallback } = require('../controllers/paymentController');

router.post('/callback', mpesaCallback);
module.exports = router;