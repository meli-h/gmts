import { pool } from '../database.js';
//GymMember
async function getGymMembers() {
    const [rows] = await pool.query("SELECT * FROM GymMember");
    return rows;
}

async function getGymMember(gymMember_id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM GymMember
        WHERE gymMember_id = ?
        `, [gymMember_id]);
    return rows[0];
}

async function createGymMember(name, surname, contactNumber, DateOfBirth, Gender, username, account_password) {
    const result = await pool.query(`
        INSERT INTO GymMember(gymMember_id)
        VALUES (?,?,?,?,?,?,?)`, [name, surname, contactNumber, DateOfBirth, Gender])

    const gymMemberAccount = await accountModel.createAccount(username, account_password);//Account olustur

    return getGymMember(gymMember_id);
}

async function deleteGymMember(gymMember_id) {
    const result = await pool.query(`
        DELETE FROM GymMember 
        WHERE gymMember_id = ?
        `, [gymMember_id]);

    return result;
}

async function updateGymMember(name, surname, contactNumber, DateOfBirth, Gender, membership_type, member_start_date, member_end_date) {//Sadece gymMember'a has ozellikleri
    const result = await pool.query(`
        UPDATE GymMember
        SET name = ?
        SET surname = ?
        SET contactNumber = ?
        SET DateOfBirth = ?
        SET Gender = ?
        SET membership_type = ?
        SET member_start_date = ?
        SET member_end_date = ?


        WHERE gymMember_id = ?;
        `, [name, surname, contactNumber, DateOfBirth, Gender, membership_type, member_start_date, member_end_date, gymMember_id]);

    return result;
}

const gymMemberModel = { getGymMembers, getGymMember, createGymMember, deleteGymMember, updateGymMember };
export default gymMemberModel;
