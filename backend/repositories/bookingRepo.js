import { pool } from '../database.js';
//Booking
async function getBookings() {
    const [rows] = await pool.query("SELECT * FROM Booking");
    return rows;
}

async function getBooking(gymMember_id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM Booking
        WHERE gymMember_id = ?
        `, [gymMember_id]);
    return rows[0];
}

async function createBooking(class_id, gymMember_id) {//classlar oluşma zamanına göre geçmiş gelecek diye ayrılacak
    const result = await pool.query(`
        INSERT INTO Booking(booking_id)
        VALUES (?,?)`, [class_id, gymMember_id])

    return getBooking(booking_id);
}

async function deleteBooking(booking_id) {
    const result = await pool.query(`
        DELETE FROM Booking 
        WHERE booking_id = ?
        `, [booking_id]);

    return result;
}

async function updateBooking(booking_id, class_id, gymMember_id, booked_at) {//Sadece booking'a has ozellikleri
    const result = await pool.query(`
        UPDATE Booking
        SET class_id = ?
        SET gymMember_id = ?
        SET booked_at = ?

        WHERE booking_id = ?;
        `, [class_id, gymMember_id, booked_at, booking_id]);

    return result;
}

const bookingModel = { getBookings, getBooking, createBooking, deleteBooking, updateBooking };
export default bookingModel;
