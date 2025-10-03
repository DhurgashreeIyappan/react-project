import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { me, updateProfile } from '../controllers/auth.controller.js';
import { getRenterDashboard } from '../controllers/user.controller.js';

const router = Router();

router.get('/me', authRequired(), me);
router.put('/me', authRequired(), updateProfile);
router.get('/renter/dashboard', authRequired(), getRenterDashboard);

export default router;


