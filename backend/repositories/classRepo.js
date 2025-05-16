import { pool } from '../database.js';

export async function listUpcomingClasses() {
  const [rows] = await pool.query(`
    SELECT c.class_id,
           c.title,
           c.start_time,
           c.duration,
           c.capacity,
           CONCAT(t.name,' ',t.surname) AS trainer,
           (SELECT COUNT(*) FROM Booking b WHERE b.class_id=c.class_id) AS enrolled
    FROM   Class c
    JOIN   Trainer t ON t.trainer_id = c.trainer_id
    WHERE  c.start_time >= NOW()
    ORDER  BY c.start_time`);
  return rows;
}

export async function getClasses() {
    const [rows] = await pool.query("SELECT * FROM Class");
    return rows;
}

export async function getClass(trainer_id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM Class
        WHERE trainer_id = ?
        `, [trainer_id]);
    return rows[0];
}

export async function createClass(trainer_id, title, start_time, duration, capacity) {
    const result = await pool.query(`
        INSERT INTO Class(class_id)
        VALUES (?,?,?,?,?)`, [trainer_id, title, start_time, duration, capacity])

    return getClass(class_id);
}

export async function deleteClass(class_id) {
    const result = await pool.query(`
        DELETE FROM Class 
        WHERE class_id = ?
        `, [class_id]);

    return result;
}

export async function updateClass(title, capacity, class_id) {//Sadece class'a has ozellikleri
    const result = await pool.query(`
        UPDATE Class
        SET title = ?
        ,capacity = ?

        WHERE class_id = ?;
        `, [title, capacity, class_id]);

    return result;
}










