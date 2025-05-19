// backend/repositories/accountRepo.js
import { pool } from '../database.js';


export async function listAccounts() {
  const [rows] = await pool.query(
    `SELECT account_id, username, account_type FROM Account`
  );
  return rows;
}

export async function getAccount(id) {
  const [rows] = await pool.query(
    `SELECT account_id, username, account_type
       FROM Account
      WHERE account_id = ?`,
    [id]
  );
  return rows[0];              // undefined dönerse controller 404 basacak
}


export async function createAccount(username, passwordHash, type, conn = null) {
  const connection = conn || pool;
  const [result] = await connection.query(
    `INSERT INTO Account (username, account_password, account_type)
          VALUES (?, ?, ?)`,
    [username, passwordHash, type]
  );
  return result.insertId;      // yeni eklenen kaydın id'si
}

export async function updateAccount(id, username, type) {
  await pool.query(
    `UPDATE Account
        SET username = ?, account_type = ?
      WHERE account_id = ?`,
    [username, type, id]
  );
}


export async function deleteAccount(id) {
  await pool.query(`DELETE FROM Account WHERE account_id = ?`, [id]);
}



export async function findAccountByUsername(username) {
  const [rows] = await pool.query(
    `SELECT * FROM Account WHERE username = ?`,
    [username]
  );
  return rows[0] || null;
}
