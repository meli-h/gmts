import { pool } from '../database.js';

//Account
export async function getAccounts() {
    const [rows] = await pool.query("SELECT * FROM Account");
    return rows;
}

export async function getAccount(username) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM Account
        WHERE username = ?
        `, [username]);
    return rows[0];
}

export async function createAccount(username, account_password, account_type) {
    const result = await pool.query(`
        INSERT INTO Account(username, account_password)
        VALUES (?,?, ?)`, [username, account_password, account_type])

    return getAccount(username);
}

export async function deleteAccount(username) {
    const result = await pool.query(`
        DELETE FROM Account 
        WHERE username = ?
        `, [username]);

    return result;
}

export async function updateAccount(username, account_password) {
    const result = await pool.query(`
        UPDATE Account
        SET username = ?, account_password = ?
        WHERE username = ?;
        `, [username, account_password, username]);

    return result;
}

// const accountModel = { getAccounts, getAccount, createAccount, deleteAccount, updateAccount };
// export default accountModel;
