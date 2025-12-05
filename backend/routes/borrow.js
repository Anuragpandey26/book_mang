import express from 'express';
import { authenticate, authorizeLibrarian, authorizeSelfOrLibrarian } from '../middleware/auth.js';
import { borrowBook, returnBook, getUserBorrowedBooks, getAllBorrowed, getOverdueBooks } from '../controllers/borrowController.js';

const router = express.Router();

router.post('/', authenticate, borrowBook);
router.post('/return/:id', authenticate, returnBook);
router.get('/users/:user_id/borrowed', getUserBorrowedBooks); 
router.get('/borrowed', authenticate, authorizeLibrarian, getAllBorrowed);
router.get('/overdue', authenticate, authorizeLibrarian, getOverdueBooks);

export default router;
