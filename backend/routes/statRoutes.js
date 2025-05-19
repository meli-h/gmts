import { Router } from 'express';
import { 
  getTrainerStats, 
  getMembershipDistribution, 
  getInactiveMembers 
} from '../controllers/statController.js';

const router = Router();

router.get('/trainers', getTrainerStats);
router.get('/membership-distribution', getMembershipDistribution);
router.get('/inactive-members', getInactiveMembers);

export default router; 