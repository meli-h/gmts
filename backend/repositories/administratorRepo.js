import { pool } from '../database.js';

//Administrator
async function getAdministrators() {
    const [rows] = await pool.query("SELECT * FROM Administrator");
    return rows;
}

async function getAdministrator(administrator_id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM Administrator
        WHERE administrator_id = ?
        `, [administrator_id]);
    return rows[0];
}

async function createAdministrator(administrator_id) {
    const result = await pool.query(`
        INSERT INTO Administrator(administrator_id)
        VALUES (?)`, [administrator_id])

    return getAdministrator(administrator_id);
}

async function deleteAdministrator(administrator_id) {
    const result = await pool.query(`
        DELETE FROM Administrator 
        WHERE administrator_id = ?
        `, [administrator_id]);

    return result;
}

// async function updateAdministrator(administrator_id) { //Gereksiz
//     const result = await pool.query(`
//         UPDATE Administrator
//         SET administrator_id = ?
//         WHERE administrator_id = ?;
//         `, [administrator_id]);

//     return result;
// }

const administratorModel = { getAdministrators, getAdministrator, createAdministrator, deleteAdministrator };
export default administratorModel;
