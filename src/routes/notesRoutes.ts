import  { Router }  from 'express';
import { createNote, deleteNote, getSingleNote, getAllNotes, updateNote } from '../controllers/notesControllers.ts';
import {authMiddleware} from '../middleware/auth.ts';
import { PrismaClient } from '@prisma/client';


const router = Router();
const prisma = new PrismaClient();

// Create a note
router.post('/', authMiddleware, createNote)

// **Get All Notes (with Redis caching)**
router.get("/", authMiddleware, getAllNotes);

// Get a single note
router.get('/:id', getSingleNote);

// Update Note
router.put('/:id', updateNote)

// Delete Note 
router.delete('/:id', authMiddleware, deleteNote)
 
// export default router;
export default router;
