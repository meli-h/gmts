import { Router } from 'express';
import {
  getAllMembers, getOneMember, addMember,
  editMember, removeMember
} from '../controllers/gymMemberController.js';

const router = Router();

router.get('/',      getAllMembers);   // GET    /api/members  ✔
router.get('/:id',   getOneMember);    // GET    /api/members/:id ✔
router.post('/',     addMember);       // POST   /api/members ✔
router.put('/:id',   editMember);      // PUT    /api/members/:id ✔
router.delete('/:id', removeMember);   // DELETE /api/members/:id ✔

export default router;
