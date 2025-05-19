// backend/routes/authRoutes.js
import { Router } from 'express';
import { login }  from '../controllers/authController.js';  // :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}

const router = Router();
router.post('/login', login);
export default router;
