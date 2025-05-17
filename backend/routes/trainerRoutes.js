import { Router } from 'express';
import {
  getAllTrainers, getOneTrainer, addTrainer,
  editTrainer, removeTrainer
} from '../controllers/trainerController.js';

const router = Router();

router.get('/',      getAllTrainers);   // GET    /api/trainers ✔
router.get('/:id',   getOneTrainer);    // GET    /api/trainers/:id ✔
router.post('/',     addTrainer);       // POST   /api/trainers ✔
router.put('/:id',   editTrainer);      // PUT    /api/trainers/:id ✔
router.delete('/:id', removeTrainer);   // DELETE /api/trainers/:id ✔

export default router;
