import express from 'express';
import { authenticate, authorizeLibrarian } from '../middleware/auth.js';
import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } from '../controllers/authorController.js';

const router = express.Router();

router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);
router.post('/', authenticate, authorizeLibrarian, createAuthor);
router.put('/:id', authenticate, authorizeLibrarian, updateAuthor);
router.delete('/:id', authenticate, authorizeLibrarian, deleteAuthor);

export default router;
