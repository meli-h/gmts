import { pool } from '../database.js';


export async function listMembers() {
  const [rows] = await pool.query(`
    SELECT gm.*, a.username
      FROM GymMember gm
      JOIN Account a ON a.account_id = gm.account_id
  `);
  return rows;
}

export async function getMember(id) { //???
  const [rows] = await pool.query(`
    SELECT gm.*, a.username
      FROM GymMember gm
      JOIN Account a ON a.account_id = gm.account_id
     WHERE gm.gymMember_id = ?
  `, [id]);
  return rows[0];
}


export async function createMember(data) {
  const {
    name, surname, contactNumber, DateOfBirth, Gender,
    membership_type, member_start_date, member_end_date, account_id
  } = data;

  const [result] = await pool.query(`
    INSERT INTO GymMember
      (name, surname, contactNumber, DateOfBirth, Gender,
       membership_type, member_start_date, member_end_date, account_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [name, surname, contactNumber, DateOfBirth, Gender,
      membership_type, member_start_date, member_end_date, account_id]);

  return result.insertId;
}

/* ---------- UPDATE ---------- */
export async function updateMember(id, data) {
  const {
    name, surname, contactNumber, DateOfBirth,
    Gender, membership_type, member_start_date, member_end_date
  } = data;

  await pool.query(`
    UPDATE GymMember
       SET name=?, surname=?, contactNumber=?, DateOfBirth=?, Gender=?,
           membership_type=?, member_start_date=?, member_end_date=?
     WHERE gymMember_id = ?
  `, [name, surname, contactNumber, DateOfBirth, Gender,
      membership_type, member_start_date, member_end_date, id]);
}

/* ---------- DELETE ---------- */
export async function deleteMember(id) {
  await pool.query(`DELETE FROM GymMember WHERE gymMember_id = ?`, [id]);
}