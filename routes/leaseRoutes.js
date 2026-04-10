import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/auth.js';
import {
  createLease,
  getLeases,
  getLeaseById,
  updateLease,
  deleteLease
} from '../controllers/leaseController.js';

router.post('/', protect, authorize('landlord', 'admin'), createLease);
router.get('/', protect, getLeases);
router.get('/:id', protect, getLeaseById);
router.put('/:id', protect, authorize('landlord', 'admin'), updateLease);
router.delete('/:id', protect, authorize('landlord', 'admin'), deleteLease);

export default  router;