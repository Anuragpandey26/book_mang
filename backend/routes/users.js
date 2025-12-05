import express from 'express';
import { authenticate, authorizeLibrarian, authorizeSelfOrLibrarian } from '../middleware/auth.js';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', authenticate, authorizeLibrarian, getAllUsers);
router.get('/:id', getUserById); 
router.post('/', authenticate, authorizeLibrarian, createUser);
router.put('/:id', authenticate, authorizeSelfOrLibrarian, updateUser);
router.delete('/:id', authenticate, authorizeLibrarian, deleteUser);

export default router;
