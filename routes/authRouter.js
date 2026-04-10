import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";
const router = Router();
const { protect } = require('../middleware/auth');

router.post("/register", register);
router.post("/login", login);
router.get('/me', protect, getMe);
router.get("/logout", logout);

export default router;
