// backend/routes/accountRoutes.js
import { Router } from 'express';
import {
  getAllAccounts,
  getOneAccount,
  addAccount,
  editAccount,
  removeAccount
} from '../controllers/accountController.js';

const router = Router();

router.get('/',    getAllAccounts);   // GET  /api/accounts
router.get('/:id', getOneAccount);    // GET  /api/accounts/:id
router.post('/',   addAccount);       // POST /api/accounts
router.put('/:id', editAccount);      // PUT  /api/accounts/:id
router.delete('/:id', removeAccount); // DELETE /api/accounts/:id

export default router;
