import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { me, updateProfile } from '../controllers/auth.controller.js';

const router = Router();

router.get('/me', authRequired(), me);
router.put('/me', authRequired(), updateProfile);

export default router;


