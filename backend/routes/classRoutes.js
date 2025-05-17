// backend/routes/classRoutes.js
import { Router } from 'express';
import {
  getAllClasses,
  getOneClass,
  addClass,
  editClass,
  removeClass
} from '../controllers/classController.js';

const router = Router();

router.get('/',         getAllClasses);  // GET    /api/classes
router.get('/:id',      getOneClass);    // GET    /api/classes/:id
router.post('/',        addClass);       // POST   /api/classes
router.put('/:id',      editClass);      // PUT    /api/classes/:id
router.delete('/:id',   removeClass);    // DELETE /api/classes/:id

export default router;
