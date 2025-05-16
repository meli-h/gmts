// backend/controllers/trainerController.js
import { listTrainers } from '../repositories/trainerRepo.js';

export const getAllTrainers = async (_req, res) =>
  res.json(await listTrainers());
