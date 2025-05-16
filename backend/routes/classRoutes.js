// backend/routes/classRoutes.js
import { Router } from 'express';
import {
  getAllClasses,
  removeClass,          
  updateClass
} from '../controllers/classController.js';

const router = Router();

router.get('/',      getAllClasses);     //  GET /api/classes
router.delete('/:id', removeClass);      //  DELETE /api/classes/:id
router.put('/:id', updateClass);     //  PUT /api/classes/:id
export default router;
