import express from 'express';
const router=express.Router();
import { register, login, me } from '../controllers/authController.js';

router.post('/register',register);
router.post('/login',login);
router.get('/me',me);