// backend/controllers/bookingController.js
import {
  listBookings,
  getBooking,
  createBooking,
  deleteBooking
} from '../repositories/bookingRepo.js';

export const getAllBookings = async (req, res) => {
  try {
    const rows = await listBookings();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch bookings' });
  }
};

export const getOneBooking = async (req, res) => {
  try {
    const b = await getBooking(req.params.id);
    if (!b) return res.status(404).json({ error: 'Booking not found' });
    res.json(b);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch booking' });
  }
};

export const addBooking = async (req, res) => {
  try {
    const { class_id, gymMember_id } = req.body;
    const id = await createBooking(class_id, gymMember_id);
    res.status(201).json({ booking_id: id });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  }
};

export const removeBooking = async (req, res) => {
  try {
    await deleteBooking(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Booking not deleted' });
  }
};
