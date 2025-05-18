const BASE = 'http://localhost:3000/api';

/* ---- helpers ---- */
const j = body => ({ headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

/* ---- Classes ---- */
export const getClasses = () => fetch(`${BASE}/classes`).then(r => r.json());
export const addClass = (b) => fetch(`${BASE}/classes`, { method: 'POST', ...j(b) });
export const deleteClass = (id) => fetch(`${BASE}/classes/${id}`, { method: 'DELETE' });

/* ---- Trainers ---- */
export const getTrainers = () => fetch(`${BASE}/trainers`).then(r => r.json());
export const addTrainer = (b) => fetch(`${BASE}/trainers`, { method: 'POST', ...j(b) });
export const deleteTrainer = (id) => fetch(`${BASE}/trainers/${id}`, { method: 'DELETE' });

/* ---- Members ---- */
export const getMembers = () => fetch(`${BASE}/gym-members`).then(r => r.json());
export const addMember = (b) => fetch(`${BASE}/gym-members`, { method: 'POST', ...j(b) });
export const deleteMember = (id) => fetch(`${BASE}/gym-member/${id}`, { method: 'DELETE' });


/* ---- Bookings ---- */
export const getBookings = () => fetch(`${BASE}/bookings`).then(r => r.json());
export const addBooking = (b) => fetch(`${BASE}/bookings`, { method: 'POST', ...j(b) });
export const deleteBooking = (id) => fetch(`${BASE}/bookings/${id}`, { method: 'DELETE' });
