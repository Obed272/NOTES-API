import  { Router }  from 'express';
import { createNote, deleteNote, getNote, getNotes, updateNote } from '../controllers/notesControllers.js';

const router = Router()
// Create a note
router.post('/', createNote)

// **Get All Notes (with Redis caching)**
router.get("/", getNotes);

// Get a single note
router.get('/:id', getNote);

// Update Note
router.put('/:id', updateNote)

// Delete Note 
router.delete('/:id', deleteNote)
 
// export default router;
export default router;
