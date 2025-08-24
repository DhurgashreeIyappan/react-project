import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { createBooking, myBookings, getAllBookings, updateStatus } from '../controllers/booking.controller.js';

const router = Router();

router.post('/', authRequired(), createBooking);
router.get('/me', authRequired(), myBookings);
router.get('/', authRequired(), getAllBookings);
router.put('/:id/status', authRequired(), updateStatus);

export default router;


