import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Protected routes (Owner only)
router.post('/', protect, authorizeRoles('owner'), createProperty);
router.put('/:id', protect, authorizeRoles('owner'), updateProperty);
router.delete('/:id', protect, authorizeRoles('owner'), deleteProperty);

export default router;
