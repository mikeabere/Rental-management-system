import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/auth.js';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController.js';

router.post('/', protect, authorize('landlord', 'admin'), createProperty);
router.get('/', protect, getProperties);
router.get('/:id', protect, getPropertyById);
router.put('/:id', protect, authorize('landlord', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('landlord', 'admin'), deleteProperty);

export default  router;