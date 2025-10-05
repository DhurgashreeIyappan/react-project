import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, me, updateProfile } from '../controllers/auth.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['owner', 'renter'])
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], login);

router.get('/me', authRequired(), me);
router.put('/me', authRequired(), updateProfile);



export default router;


