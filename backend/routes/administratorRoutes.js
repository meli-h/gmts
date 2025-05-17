import { Router } from 'express';
import {
  getAdministrator, addAdministrator,
  editAdministrator, removeAdministrator
} from '../controllers/administratorController.js';

const router = Router();

router.get('/',      getAdministrator); // GET  /api/admin ✔
router.post('/',     addAdministrator); // POST /api/admin ✔
router.put('/:id',   editAdministrator); // PUT  /api/admin/:id (gerek kalmayacak gibi) 
router.delete('/:id', removeAdministrator); // DELETE /api/admin/:id (gerek kalmayacak gibi) 

export default router;
