import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/authController.js";
const router = Router();
import { protect } from '../middleware/auth.js';

router.post("/register", register);
router.post("/login", login);
router.get('/me', protect, getMe);
router.get("/logout", logout);

export default router;
