import { pool } from '../database.js';

export async function listTrainers() {
  const [rows] = await pool.query(`
    SELECT trainer_id, name, surname, contactNumber
    FROM Trainer ORDER BY surname, name`);
  return rows;
}

export async function getTrainers() {
    const [rows] = await pool.query("SELECT * FROM Trainer");
    return rows;
}

export async function getTrainer(trainer_id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM Trainer
        WHERE trainer_id = ?
        `, [trainer_id]);
    return rows[0];
}

export async function createTrainer(name, surname, contactNumber, DateOfBirth, Gender, username, account_password) {
    const result = await pool.query(`
        INSERT INTO Trainer(trainer_id)
        VALUES (?,?,?,?,?,?,?)`, [name, surname, contactNumber, DateOfBirth, Gender])

    const trainerAccount = await accountModel.createAccount(username, account_password);//Account olustur

    return getTrainer(trainer_id);
}

export async function deleteTrainer(trainer_id) {
    const result = await pool.query(`
        DELETE FROM Trainer 
        WHERE trainer_id = ?
        `, [trainer_id]);

    return result;
}

export async function updateTrainer(name, surname, contactNumber, DateOfBirth, Gender) {//Sadece trainer'a has ozellikleri
    const result = await pool.query(`
        UPDATE Trainer
        SET name = ?
        SET surname = ?
        SET contactNumber = ?
        SET DateOfBirth = ?
        SET Gender = ?

        WHERE trainer_id = ?;
        `, [name, surname, contactNumber, DateOfBirth, Gender, trainer_id]);

    return result;
}



const trainerModel = { getTrainers, getTrainer, createTrainer, deleteTrainer, updateTrainer, listTrainers };
export default trainerModel;


