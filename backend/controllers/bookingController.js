import {
  listBookings, getBooking, createBooking, deleteBooking
} from '../repositories/bookingRepo.js';

export const getAllBookings = async (_req, res) =>
  res.json(await listBookings());

export const getOneBooking = async (req, res) => {
  const b = await getBooking(req.params.id);
  if (!b) return res.status(404).json({ error: 'Booking not found' });
  res.json(b);
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
