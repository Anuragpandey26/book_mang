import express from 'express';
import { authenticate, authorizeLibrarian } from '../middleware/auth.js';
import {
  createBorrowRequest,
  getUserRequests,
  getAllPendingRequests,
  approveRequest,
  rejectRequest
} from '../controllers/borrowRequestController.js';

const router = express.Router();

router.post('/', authenticate, createBorrowRequest);
router.get('/my-requests', authenticate, getUserRequests);
router.get('/pending', authenticate, authorizeLibrarian, getAllPendingRequests);
router.post('/:id/approve', authenticate, authorizeLibrarian, approveRequest);
router.post('/:id/reject', authenticate, authorizeLibrarian, rejectRequest);

export default router;
