// backend/routes/trainerRoutes.js
import { Router } from 'express';
import { getAllTrainers } from '../controllers/trainerController.js';

export default Router().get('/', getAllTrainers);   // GET /api/trainers
