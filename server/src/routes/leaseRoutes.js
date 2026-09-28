import express from 'express';
import { createLease, getLeases, getLeaseById, updateLease, deleteLease } from '../controllers/leaseController.js';
const router=express.Router();

router.post('/', createLease);
router.get('/', getLeases);
router.get('/:id', getLeaseById);
router.put('/:id', updateLease);
router.delete('/:id', deleteLease);