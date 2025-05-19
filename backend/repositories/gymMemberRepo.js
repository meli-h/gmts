// backend/repositories/gymMemberRepo.js
import { pool } from '../database.js';
import { createAccount } from './accountRepo.js';
import bcrypt from 'bcrypt';

/* ---------- LIST & GET DEĞİŞMEDİ ---------- */
export async function listGymMembers() {
  const [rows] = await pool.query(`
    SELECT gm.*, a.username
      FROM GymMember gm
      JOIN Account a ON a.account_id = gm.account_id`);
  return rows;
}

export async function getGymMember(id) {
  const [rows] = await pool.query(`
    SELECT gm.*, a.username
      FROM GymMember gm
      JOIN Account a ON a.account_id = gm.account_id
     WHERE gm.gymMember_id = ?`, [id]);
  return rows[0];
}

/* ---------- CREATE Member + Account ---------- */
function endDate(start, type) {
  const d = new Date(start);
  if (type === 'Quarterly') d.setMonth(d.getMonth() + 3);
  else if (type === 'Yearly') d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);              // Monthly (varsayılan)
  return d.toISOString().slice(0, 10);
}

export async function createGymMember(data) {
  // membershipType (camelCase) veya membership_type (snake_case) gelebilir
  const {
    name, surname, contactNumber, DateOfBirth, Gender,
    membershipType, membership_type,
    username, password
  } = data;

  const dobDate = new Date(data.DateOfBirth);
  const type = membership_type ?? membershipType;      // 'Monthly' | 'Quarterly' | 'Yearly'
  const start = new Date().toISOString().slice(0, 10);
  const end   = endDate(start, type);

  /* 1) Account */
  const hash = await bcrypt.hash(password, 10);
  const account_id = await createAccount(username, hash, 'GymMember');

  /* 2) GymMember */
  const [r] = await pool.query(`
    INSERT INTO GymMember
      (name, surname, contactNumber, DateOfBirth, Gender,
       membership_type, member_start_date, member_end_date, account_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name, surname, contactNumber,
      dobDate,           // ← JS Date
      Gender, type, start, end, account_id
    ]
  );
  return r.insertId;
}

/* ---------- UPDATE & DELETE aynen ---------- */
export async function updateGymMember(id, d) {
  const {
    name, surname, contactNumber, DateOfBirth, Gender,
    membership_type, member_start_date, member_end_date
  } = d;

  await pool.query(`
    UPDATE GymMember
       SET name=?, surname=?, contactNumber=?, DateOfBirth=?, Gender=?,
           membership_type=?, member_start_date=?, member_end_date=?
     WHERE gymMember_id = ?`,
    [name, surname, contactNumber, DateOfBirth, Gender,
     membership_type, member_start_date, member_end_date, id]);
}

export async function deleteGymMember(id) {
  await pool.query(`DELETE FROM GymMember WHERE gymMember_id = ?`, [id]);
}

// Export the getMember function as getMemberByAccountId for use in auth
export async function getMemberByAccountId(accountId) {
  const [rows] = await pool.query(`
    SELECT gm.*, a.username
      FROM GymMember gm
      JOIN Account a ON a.account_id = gm.account_id
     WHERE gm.account_id = ?`, [accountId]);
  return rows[0];
}
