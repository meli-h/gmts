import { pool } from '../database.js';

export async function listTrainers() {    //????????
  const [rows] = await pool.query(`
    SELECT t.*, a.username
      FROM Trainer t
      JOIN Account a ON a.account_id = t.account_id
  `);
  return rows;
}

export async function getTrainer(id) {   //????????
  const [rows] = await pool.query(`
    SELECT t.*, a.username
      FROM Trainer t
      JOIN Account a ON a.account_id = t.account_id
     WHERE t.trainer_id = ?`, [id]);
  return rows[0];
}

export async function createTrainer(data) {
  const { name, surname, contactNumber, DateOfBirth, Gender, account_id } = data;
  const [r] = await pool.query(`
    INSERT INTO Trainer
      (name, surname, contactNumber, DateOfBirth, Gender, account_id)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [name, surname, contactNumber, DateOfBirth, Gender, account_id]);
  return r.insertId;
}

export async function updateTrainer(id, data) {
  const { name, surname, contactNumber, DateOfBirth, Gender } = data;
  await pool.query(`
    UPDATE Trainer
       SET name=?, surname=?, contactNumber=?, DateOfBirth=?, Gender=?
     WHERE trainer_id = ?`,
    [name, surname, contactNumber, DateOfBirth, Gender, id]);
}

export async function deleteTrainer(id) {
  await pool.query(`DELETE FROM Trainer WHERE trainer_id = ?`, [id]);
}
