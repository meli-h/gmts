import { pool } from '../database.js';

export async function getAdmin() {    //????????
  const [rows] = await pool.query(`
    SELECT a.*, acc.username
      FROM Administrator a
      JOIN Account acc ON acc.account_id = a.account_id
     LIMIT 1`);
  return rows[0];
}

export async function createAdmin(account_id) {
  const [r] = await pool.query(`
    INSERT INTO Administrator (account_id) VALUES (?)`, [account_id]);
  return r.insertId;
}

export async function updateAdmin(id, account_id) {
  await pool.query(`
    UPDATE Administrator SET account_id = ? WHERE administrator_id = ?`,
    [account_id, id]);
}

export async function deleteAdmin(id) {
  await pool.query(`DELETE FROM Administrator WHERE administrator_id = ?`, [id]);
}
