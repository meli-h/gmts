  // backend/repositories/trainerRepo.js
  import { pool } from '../database.js';
  import { createAccount } from './accountRepo.js';
  import bcrypt from 'bcrypt';

  /* ---------- LIST & GET DEĞİŞMEDİ ---------- */
  export async function listTrainers() {
    const [rows] = await pool.query(`
      SELECT t.*, a.username
        FROM Trainer t
        JOIN Account a ON a.account_id = t.account_id`);
    return rows;
  }

  export async function getTrainer(id) {
    const [rows] = await pool.query(`
      SELECT t.*, a.username
        FROM Trainer t
        JOIN Account a ON a.account_id = t.account_id
      WHERE t.trainer_id = ?`, [id]);
    return rows[0];
  }

  /* ---------- CREATE Trainer + Account ---------- */
  export async function createTrainer(data) {
    const {
      name, surname, contactNumber, DateOfBirth, Gender,
      username, password   // ← formdan gelen hesap bilgileri
    } = data;

    /* 1) Account kaydı */
    const hash = await bcrypt.hash(password, 10);
    const account_id = await createAccount(username, hash, 'Trainer');

    /* 2) Trainer kaydı */
    const [r] = await pool.query(`
      INSERT INTO Trainer
        (name, surname, contactNumber, DateOfBirth, Gender, account_id)
      VALUES (?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'), ?, ?)`,
      [name, surname, contactNumber, DateOfBirth, Gender, account_id]);

    return r.insertId;          // controller 201 içinde dönecek
  }

  /* ---------- UPDATE & DELETE aynen ---------- */
  export async function updateTrainer(id, d) {
    const { name, surname, contactNumber, DateOfBirth, Gender } = d;
    await pool.query(`
      UPDATE Trainer
        SET name=?, surname=?, contactNumber=?, DateOfBirth=?, Gender=?
      WHERE trainer_id = ?`,
      [name, surname, contactNumber, DateOfBirth, Gender, id]);
  }

  export async function deleteTrainer(id) {
    await pool.query(`DELETE FROM Trainer WHERE trainer_id = ?`, [id]);
  }
