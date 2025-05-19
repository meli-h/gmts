import { pool } from '../database.js';

// Get trainers with class counts and total participants
export const getTrainerStats = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        t.trainer_id,
        CONCAT(t.name,' ',t.surname) AS trainer,
        COUNT(DISTINCT c.class_id)   AS class_cnt,
        COUNT(b.booking_id)          AS total_participants
      FROM Trainer t
      LEFT JOIN Class   c ON c.trainer_id = t.trainer_id
      LEFT JOIN Booking b ON b.class_id   = c.class_id
      GROUP BY t.trainer_id, trainer
      ORDER BY total_participants DESC
      LIMIT 10
    `);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching trainer stats:', err);
    res.status(500).json({ error: 'Failed to fetch trainer statistics' });
  }
};

// Get membership type distribution
export const getMembershipDistribution = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        membership_type,
        COUNT(*)                 AS member_count,
        ROUND(COUNT(*) * 100 /
              (SELECT COUNT(*) FROM GymMember), 1) AS pct_total
      FROM GymMember
      GROUP BY membership_type
    `);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching membership distribution:', err);
    res.status(500).json({ error: 'Failed to fetch membership distribution' });
  }
};

// Get members with no bookings
export const getInactiveMembers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.gymMember_id, g.name, g.surname
      FROM   GymMember g
      LEFT JOIN Booking b ON b.gymMember_id = g.gymMember_id
      WHERE  b.booking_id IS NULL
      LIMIT 100
    `);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching inactive members:', err);
    res.status(500).json({ error: 'Failed to fetch inactive members' });
  }
};

// Get class popularity analysis
export const getClassPopularity = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.class_id,
        c.title AS class_name,
        COUNT(b.booking_id) AS booking_count,
        DAYNAME(c.start_time) AS day_of_week,
        DATE_FORMAT(c.start_time, '%H:%i') AS start_time,
        CONCAT(t.name, ' ', t.surname) AS trainer_name
      FROM Class c
      LEFT JOIN Booking b ON b.class_id = c.class_id
      LEFT JOIN Trainer t ON t.trainer_id = c.trainer_id
      WHERE c.title IS NOT NULL
      GROUP BY c.class_id, c.title, day_of_week, start_time, trainer_name
      ORDER BY booking_count DESC
      LIMIT 10
    `);
    
    // Ensure we're returning an array even if no results
    res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error('Error fetching class popularity:', err);
    res.status(500).json({ error: 'Failed to fetch class popularity data: ' + err.message });
  }
};

// Get member engagement metrics
export const getMemberEngagement = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        g.gymMember_id,
        CONCAT(g.name, ' ', g.surname) AS member_name,
        COUNT(b.booking_id) AS total_bookings,
        COUNT(DISTINCT DATE(c.start_time)) AS unique_days,
        MAX(c.start_time) AS last_booking,
        g.membership_type
      FROM GymMember g
      JOIN Booking b ON b.gymMember_id = g.gymMember_id
      JOIN Class c ON c.class_id = b.class_id
      WHERE g.name IS NOT NULL AND g.surname IS NOT NULL
      GROUP BY g.gymMember_id, member_name, g.membership_type
      ORDER BY total_bookings DESC
      LIMIT 10
    `);
    
    // Ensure we're returning an array even if no results
    res.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error('Error fetching member engagement:', err);
    res.status(500).json({ error: 'Failed to fetch member engagement data: ' + err.message });
  }
}; 