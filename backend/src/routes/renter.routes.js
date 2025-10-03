import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { getRenterDashboard } from '../controllers/user.controller.js';

const router = Router();

// Renter-specific dashboard
router.get('/dashboard', authRequired(), getRenterDashboard);

export default router;


