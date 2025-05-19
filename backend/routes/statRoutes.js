import { Router } from 'express';
import { 
  getTrainerStats, 
  getMembershipDistribution, 
  getInactiveMembers,
  getClassPopularity,
  getMemberEngagement
} from '../controllers/statController.js';

const router = Router();

router.get('/trainers', getTrainerStats);
router.get('/membership-distribution', getMembershipDistribution);
router.get('/inactive-members', getInactiveMembers);
router.get('/class-popularity', getClassPopularity);
router.get('/member-engagement', getMemberEngagement);

export default router; 