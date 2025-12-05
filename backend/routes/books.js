import express from 'express';
import { authenticate, authorizeLibrarian } from '../middleware/auth.js';
import { getAllBooks, getBookById, checkAvailability, createBook, updateBook, deleteBook } from '../controllers/bookController.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.get('/:id/availability', checkAvailability);
router.post('/', authenticate, authorizeLibrarian, createBook);
router.put('/:id', authenticate, authorizeLibrarian, updateBook);
router.delete('/:id', authenticate, authorizeLibrarian, deleteBook);

export default router;
