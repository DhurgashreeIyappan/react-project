import { Router } from 'express';
import { body } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import { createProperty, updateProperty, deleteProperty, myProperties, getProperty, listProperties, getAllPropertiesForOwner, resetAvailability } from '../controllers/property.controller.js';
import upload from '../middleware/upload.js';

const router = Router();

// Public routes
router.get('/', listProperties);
router.get('/:id', getProperty);

// Owner routes
router.get('/me/list', authRequired(['owner']), myProperties);
router.get('/me/all', authRequired(['owner']), getAllPropertiesForOwner);

router.post('/', authRequired(['owner']), upload.array('images', 5), [
  body('title').notEmpty().withMessage('Property title is required'),
  body('description').notEmpty().withMessage('Property description is required'),
  body('price').isNumeric().withMessage('Price must be a valid number'),
  body('location').notEmpty().withMessage('Location is required'),
  body('propertyType').notEmpty().withMessage('Property type is required'),
  body('bedrooms').isNumeric().withMessage('Bedrooms must be a valid number'),
  body('bathrooms').isNumeric().withMessage('Bathrooms must be a valid number'),
  body('size').isNumeric().withMessage('Property size must be a valid number'),
  body('furnished').notEmpty().withMessage('Furnished status is required'),
  body('images').optional().isArray().withMessage('Images must be an array')
], createProperty);

router.put('/:id', authRequired(['owner']), upload.array('images', 5), updateProperty);
router.delete('/:id', authRequired(['owner']), deleteProperty);
router.post('/:id/reset-availability', authRequired(['owner']), resetAvailability);

export default router;


