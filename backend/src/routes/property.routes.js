import { Router } from 'express';
import { body } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import { createProperty, updateProperty, deleteProperty, myProperties, getProperty, listProperties } from '../controllers/property.controller.js';

const router = Router();

router.get('/', listProperties);
router.get('/:id', getProperty);
router.get('/me/list', authRequired(['owner', 'renter']), myProperties);

router.post('/', authRequired(['owner', 'renter']), [
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('price').isNumeric(),
  body('location').notEmpty(),
  body('type').notEmpty()
], createProperty);

router.put('/:id', authRequired(['owner', 'renter']), updateProperty);
router.delete('/:id', authRequired(['owner', 'renter']), deleteProperty);

export default router;


