// backend/repositories/bookingRepo.js
import { pool } from '../database.js';

async function capacityAvailable(class_id) {
  const [[row]] = await pool.query(`
    SELECT capacity - (
      SELECT COUNT(*) FROM Booking WHERE class_id = ?
    ) AS spots
    FROM Class
    WHERE class_id = ?
  `, [class_id, class_id]);
  return row && row.spots > 0;
}

export async function createBooking(class_id, gymMember_id) {
  // 1) Kapasite
  if (!(await capacityAvailable(class_id))) {
    const e = new Error('Class is full');
    e.status = 409;
    throw e;
  }

  // 2) Üyelik geçerliliği: önce dersin tarihini al
  const [[cls]] = await pool.query(`
    SELECT start_time
      FROM Class
     WHERE class_id = ?
  `, [class_id]);
  if (!cls) {
    const e = new Error('Class not found');
    e.status = 404;
    throw e;
  }

  const [[member]] = await pool.query(`
    SELECT member_start_date, member_end_date
      FROM GymMember
     WHERE gymMember_id = ?
  `, [gymMember_id]);
  if (!member) {
    const e = new Error('GymMember not found');
    e.status = 404;
    throw e;
  }

  const classDate = new Date(cls.start_time);
  if (
    classDate < new Date(member.member_start_date) ||
    classDate > new Date(member.member_end_date)
  ) {
    const e = new Error('Membership inactive for class date');
    e.status = 400;
    throw e;
  }

  // 3) Insert ve duplicate kontrolü
  try {
    const [r] = await pool.query(`
      INSERT INTO Booking (class_id, gymMember_id)
      VALUES (?, ?)
    `, [class_id, gymMember_id]);
    return r.insertId;
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      const e = new Error('Already booked this class');
      e.status = 409;
      throw e;
    }
    throw err;
  }
}

export async function deleteBooking(id) {
  await pool.query(`DELETE FROM Booking WHERE booking_id = ?`, [id]);
}

export async function listBookings() {const [rows] = await pool.query(`
  SELECT 
    b.booking_id,
    b.class_id,
    b.gymMember_id,
    c.title,
    c.start_time
  FROM Booking b
  JOIN Class c ON c.class_id = b.class_id
  ORDER BY b.booking_id
`);
return rows;}
export async function getBooking(id) {const [rows] = await pool.query(`
  SELECT 
    b.booking_id,
    b.class_id,
    b.gymMember_id,
    c.title,
    c.start_time
  FROM Booking b
  JOIN Class c ON c.class_id = b.class_id
  ORDER BY b.booking_id
`);
return rows;}
