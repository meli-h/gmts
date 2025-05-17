import { Router } from 'express';
import {
  getAllBookings, getOneBooking, addBooking, removeBooking
} from '../controllers/bookingController.js';

const router = Router();

router.get('/',      getAllBookings);   // GET    /api/bookings
router.get('/:id',   getOneBooking);    // GET    /api/bookings/:id
router.post('/',     addBooking);       // POST   /api/bookings
router.delete('/:id', removeBooking);   // DELETE /api/bookings/:id

export default router;
