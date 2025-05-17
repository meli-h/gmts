import { pool } from '../database.js';

/* Yardımcı: sınıfta boş yer var mı? */
async function capacityAvailable(class_id) {
  const [[row]] = await pool.query(`
    SELECT capacity - (SELECT COUNT(*) FROM Booking WHERE class_id = ?) AS spots
      FROM Class
     WHERE class_id = ?`,
    [class_id, class_id]);
  return row && row.spots > 0;
}

export async function listBookings() {
  const [rows] = await pool.query(`
    SELECT b.*, c.title, c.start_time,
           gm.name AS member_name, gm.surname AS member_surname
      FROM Booking b
      JOIN Class      c  ON c.class_id      = b.class_id
      JOIN GymMember  gm ON gm.gymMember_id = b.gymMember_id
  `);
  return rows;
}

export async function getBooking(id) {
  const [rows] = await pool.query(`SELECT * FROM Booking WHERE booking_id = ?`, [id]);
  return rows[0];
}

export async function createBooking(class_id, gymMember_id) {
  /* 1) Kapasite kontrolü */
  if (!(await capacityAvailable(class_id))) {
    const e = new Error('Class is full'); e.status = 409; throw e;
  }

  /* 2) Üyelik tarih aralığı */
  const [[active]] = await pool.query(`
    SELECT 1
      FROM GymMember gm
      JOIN Class c ON c.class_id = ?
     WHERE gm.gymMember_id = ?
       AND c.start_time BETWEEN gm.member_start_date AND gm.member_end_date`,
    [class_id, gymMember_id]);
  if (!active) {
    const e = new Error('Membership inactive for class date'); e.status = 400; throw e;
  }

  /* 3) Kaydet */
  const [r] = await pool.query(`
    INSERT INTO Booking (class_id, gymMember_id)
    VALUES (?, ?)`,
    [class_id, gymMember_id]);
  return r.insertId;
}

export async function deleteBooking(id) {
  await pool.query(`DELETE FROM Booking WHERE booking_id = ?`, [id]);
}
