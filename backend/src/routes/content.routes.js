import { Router } from 'express';
import { getAbout, getContactInfo } from '../controllers/content.controller.js';

const router = Router();

router.get('/about', getAbout);
router.get('/contact', getContactInfo);

export default router;


