// backend/repositories/classRepo.js
import { pool } from '../database.js';

/* ---------- LIST ALL / UPCOMING ---------- */
export async function listUpcomingClasses() {
  const [rows] = await pool.query(`
    SELECT
      c.class_id,
      c.trainer_id,    
      c.title,
      c.start_time,
      c.duration,
      c.capacity,
      CONCAT(t.name, ' ', t.surname) AS trainer,
      (SELECT COUNT(*) FROM Booking b WHERE b.class_id = c.class_id) AS enrolled
    FROM Class c
    JOIN Trainer t ON t.trainer_id = c.trainer_id
    WHERE c.start_time >= NOW()
    ORDER BY c.start_time
  `);
  return rows;
}

/* ---------- GET ONE BY ID ---------- */
export async function getClassById(class_id) {
  const [rows] = await pool.query(`
    SELECT *
      FROM Class
     WHERE class_id = ?
  `, [class_id]);
  return rows[0];
}

/* ---------- CREATE ---------- */
export async function createClass(data) {
  const { trainer_id, title, start_time, duration, capacity } = data;

  // Çakışma kontrolü: aynı trainer aynı anda başka derste olmamalı
  const [conflict] = await pool.query(`
    SELECT COUNT(*) AS cnt
      FROM Class
     WHERE trainer_id = ?
       AND ( ? < DATE_ADD(start_time, INTERVAL duration MINUTE) )
       AND ( DATE_ADD(?, INTERVAL duration MINUTE) > start_time )
  `, [trainer_id, start_time, start_time]);
  if (conflict[0].cnt > 0) {
    const e = new Error('Trainer schedule conflict');
    e.status = 409;
    throw e;
  }

  const [res] = await pool.query(`
    INSERT INTO Class
      (trainer_id, title, start_time, duration, capacity)
    VALUES (?, ?, ?, ?, ?)
  `, [trainer_id, title, start_time, duration, capacity]);
  return res.insertId;
}

/* ---------- UPDATE ---------- */
export async function updateClass(class_id, data) {
  const { title, start_time, duration, capacity } = data;
  
  // If start_time is provided, check for schedule conflicts
  if (start_time) {
    // Get trainer_id for this class
    const [classRow] = await pool.query(
      `SELECT trainer_id, class_id FROM Class WHERE class_id = ?`, 
      [class_id]
    );
    
    if (classRow.length === 0) {
      const e = new Error('Class not found');
      e.status = 404;
      throw e;
    }
    
    const trainer_id = classRow[0].trainer_id;
    
    // Check for conflicts with other classes (excluding this one)
    const [conflict] = await pool.query(`
      SELECT COUNT(*) AS cnt
        FROM Class
       WHERE trainer_id = ?
         AND class_id != ?
         AND ( ? < DATE_ADD(start_time, INTERVAL duration MINUTE) )
         AND ( DATE_ADD(?, INTERVAL duration MINUTE) > start_time )
    `, [trainer_id, class_id, start_time, start_time]);
    
    if (conflict[0].cnt > 0) {
      const e = new Error('Trainer schedule conflict');
      e.status = 409;
      throw e;
    }
    
    await pool.query(`
      UPDATE Class
         SET title = ?, start_time = ?, duration = ?, capacity = ?
       WHERE class_id = ?
    `, [title, start_time, duration, capacity, class_id]);
  } else {
    await pool.query(`
      UPDATE Class
         SET title = ?, duration = ?, capacity = ?
       WHERE class_id = ?
    `, [title, duration, capacity, class_id]);
  }
}

/* ---------- DELETE ---------- */
export async function deleteClass(class_id) {
  await pool.query(`DELETE FROM Class WHERE class_id = ?`, [class_id]);
}
